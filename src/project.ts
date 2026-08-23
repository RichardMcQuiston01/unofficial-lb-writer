import type { Mat } from './matrix';
import { escapeXml } from './xml';
import { bitmapShape, ellipseShape, pathShape, rectShape, textShape, type TextShapeOptions } from './shapes';

/** A vector `CutSetting` to register with {@link Lbrn2ProjectBuilder.addCutSetting}. */
export interface CutSettingSpec {
  name: string;
  /** LightBurn operation: Cut = line, Scan = fill/engrave. */
  type: 'Cut' | 'Scan';
  maxPower: number;
  speed: number;
}

/** A `CutSetting_Img` to register with {@link Lbrn2ProjectBuilder.addImageCutSetting}. */
export interface ImageCutSettingSpec {
  /** Absent → 'Image'. */
  name?: string;
  /** Absent → 20. */
  maxPower?: number;
  /** Absent → 100. */
  speed?: number;
  /** Absent → 'stucki'. */
  ditherMode?: string;
}

/**
 * Incrementally builds a `.lbrn2` project: register `CutSetting`s (each
 * call returns the index shapes should reference), add shapes, then
 * serialize with {@link toXml}. Registration order is preserved as-is —
 * callers that need deduplication or a specific ordering (e.g. engrave
 * before cut) should apply it before calling `addCutSetting`.
 */
export interface Lbrn2ProjectBuilder {
  /** Registers a vector `CutSetting` and returns its index. */
  addCutSetting(spec: CutSettingSpec): number;
  /** Registers the image `CutSetting_Img` and returns its index. */
  addImageCutSetting(spec?: ImageCutSettingSpec): number;
  /** Adds a `<Shape Type="Rect">` centered at the origin of `m`. */
  addRect(cutIndex: number, m: Mat, width: number, height: number, cornerRadius: number): void;
  /** Adds a `<Shape Type="Ellipse">` centered at the origin of `m`. */
  addEllipse(cutIndex: number, m: Mat, radiusX: number, radiusY: number): void;
  /** Adds a `<Shape Type="Path">` from local `points` (`[x0, y0, x1, y1, …]`). */
  addPath(cutIndex: number, m: Mat, points: number[]): void;
  /** Adds a `<Shape Type="Text">`. */
  addText(
    cutIndex: number,
    m: Mat,
    text: string,
    font: string,
    fontSizeMm: number,
    options?: TextShapeOptions
  ): void;
  /** Adds a `<Shape Type="Bitmap">` with `base64` embedded in `Data`. */
  addBitmap(cutIndex: number, m: Mat, widthMm: number, heightMm: number, base64: string): void;
  /** Serializes the project to a `.lbrn2` XML string. */
  toXml(): string;
}

/** Creates a fresh, empty `.lbrn2` project builder. */
export function createLbrn2Project(): Lbrn2ProjectBuilder {
  const cutSettings: string[] = [];
  const shapes: string[] = [];

  return {
    addCutSetting(spec) {
      const index = cutSettings.length;
      cutSettings.push(
        `<CutSetting type="${spec.type}">\n` +
          `<index Value="${index}"/>\n` +
          `<name Value="${escapeXml(spec.name)}"/>\n` +
          `<maxPower Value="${spec.maxPower}"/>\n` +
          `<speed Value="${spec.speed}"/>\n` +
          '</CutSetting>'
      );
      return index;
    },
    addImageCutSetting(spec = {}) {
      const index = cutSettings.length;
      cutSettings.push(
        '<CutSetting_Img type="Image">\n' +
          `<index Value="${index}"/>\n` +
          `<name Value="${escapeXml(spec.name ?? 'Image')}"/>\n` +
          `<maxPower Value="${spec.maxPower ?? 20}"/>\n` +
          `<speed Value="${spec.speed ?? 100}"/>\n` +
          `<ditherMode Value="${spec.ditherMode ?? 'stucki'}"/>\n` +
          '</CutSetting_Img>'
      );
      return index;
    },
    addRect(cutIndex, m, width, height, cornerRadius) {
      shapes.push(rectShape(cutIndex, m, width, height, cornerRadius));
    },
    addEllipse(cutIndex, m, radiusX, radiusY) {
      shapes.push(ellipseShape(cutIndex, m, radiusX, radiusY));
    },
    addPath(cutIndex, m, points) {
      shapes.push(pathShape(cutIndex, m, points));
    },
    addText(cutIndex, m, text, font, fontSizeMm, options) {
      shapes.push(textShape(cutIndex, m, text, font, fontSizeMm, options));
    },
    addBitmap(cutIndex, m, widthMm, heightMm, base64) {
      shapes.push(bitmapShape(cutIndex, m, widthMm, heightMm, base64));
    },
    toXml() {
      return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<LightBurnProject AppVersion="1.4.00" FormatVersion="0" MaterialHeight="0" MirrorX="False" MirrorY="False">',
        ...cutSettings,
        ...shapes,
        '</LightBurnProject>',
      ].join('\n');
    },
  };
}
