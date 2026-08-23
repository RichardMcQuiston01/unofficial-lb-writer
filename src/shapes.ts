import { applyToPoint, IDENTITY, multiply, type Mat } from './matrix';
import { escapeXml, fmt, xform } from './xml';

/** A matrix that mirrors the Y axis in place, used to un-reflect shapes. */
const MIRROR_Y: Mat = [1, 0, 0, -1, 0, 0];

/** Whether `m` has a negative determinant (i.e. it mirrors its content). */
function isReflected(m: Mat): boolean {
  return m[0] * m[3] - m[1] * m[2] < 0;
}

/**
 * Bitmaps and glyph text draw through their `<XForm>` rather than as
 * absolute vertices, so a reflected (negative-determinant) transform
 * visually mirrors them. Un-mirror locally so the pixels/glyphs stay
 * upright under an outer flip (e.g. a project-level Y flip).
 */
function unmirror(m: Mat): Mat {
  return isReflected(m) ? multiply(m, MIRROR_Y) : m;
}

/** Serializes a `<Shape Type="Rect">` centered at the origin of `m`. */
export function rectShape(
  cutIndex: number,
  m: Mat,
  width: number,
  height: number,
  cornerRadius: number
): string {
  return `<Shape Type="Rect" CutIndex="${cutIndex}" W="${fmt(width)}" H="${fmt(
    height
  )}" Cr="${fmt(cornerRadius)}">${xform(m)}</Shape>`;
}

/** Serializes a `<Shape Type="Ellipse">` centered at the origin of `m`. */
export function ellipseShape(
  cutIndex: number,
  m: Mat,
  radiusX: number,
  radiusY: number
): string {
  return `<Shape Type="Ellipse" CutIndex="${cutIndex}" Rx="${fmt(
    radiusX
  )}" Ry="${fmt(radiusY)}">${xform(m)}</Shape>`;
}

/**
 * Serializes a `<Shape Type="Path">` from local `points` (`[x0, y0, x1,
 * y1, …]`). `m` positions each vertex directly, so the emitted `<XForm>`
 * is always identity.
 */
export function pathShape(cutIndex: number, m: Mat, points: number[]): string {
  if (points.length % 2 !== 0) {
    throw new Error('points must contain complete x/y coordinate pairs');
  }
  const vertices: string[] = [];
  const primitives: string[] = [];
  for (let i = 0; i < points.length; i += 2) {
    const [vx, vy] = applyToPoint(m, points[i], points[i + 1]);
    vertices.push(`<V vx="${fmt(vx)}" vy="${fmt(vy)}"/>`);
    if (i > 0) {
      primitives.push(`<P T="L" p0="${i / 2 - 1}" p1="${i / 2}"/>`);
    }
  }
  return `<Shape Type="Path" CutIndex="${cutIndex}">${xform(
    IDENTITY
  )}${vertices.join('')}${primitives.join('')}</Shape>`;
}

/** Options for {@link textShape}. */
export interface TextShapeOptions {
  /** Extra space between characters, in mm. Absent → 0. */
  letterSpacing?: number;
  /** Extra spacing beyond the font's default line height, in mm. Absent → 0. */
  lineSpacing?: number;
  /** Horizontal alignment, mapped to LightBurn's `Ah` anchor code. Absent → 'left'. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Serializes a `<Shape Type="Text">`. `m` should already carry the
 * anchor-point offset for `align` (LightBurn anchors text at `m`'s
 * origin); this only maps `align` to the `Ah` attribute.
 */
export function textShape(
  cutIndex: number,
  m: Mat,
  text: string,
  font: string,
  fontSizeMm: number,
  options: TextShapeOptions = {}
): string {
  const { letterSpacing = 0, lineSpacing = 0, align = 'left' } = options;
  const ah = align === 'center' ? 1 : align === 'right' ? 2 : 0;
  return `<Shape Type="Text" CutIndex="${cutIndex}" Str="${escapeXml(
    text
  )}" Font="${escapeXml(font)}" H="${fmt(fontSizeMm)}" LS="${fmt(
    letterSpacing
  )}" LnS="${fmt(lineSpacing)}" Ah="${ah}" Av="1">${xform(
    unmirror(m)
  )}</Shape>`;
}

/**
 * Serializes a `<Shape Type="Bitmap">` with the PNG embedded base64 in
 * `Data`. `m` should position the bitmap's center (local coordinates
 * are centered on the origin, like Rect).
 */
export function bitmapShape(
  cutIndex: number,
  m: Mat,
  widthMm: number,
  heightMm: number,
  base64: string
): string {
  return (
    `<Shape Type="Bitmap" CutIndex="${cutIndex}" W="${fmt(
      widthMm
    )}" H="${fmt(heightMm)}" Gamma="1" Contrast="0" Brightness="0" ` +
    `EnhanceAmount="0" EnhanceRadius="0" EnhanceDenoise="0" File="" ` +
    `SourceHash="0" Data="${escapeXml(base64)}">${xform(unmirror(m))}</Shape>`
  );
}
