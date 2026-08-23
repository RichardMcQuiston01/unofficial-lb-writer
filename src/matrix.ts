/**
 * Row-major 2D affine matrix `[a, b, c, d, tx, ty]`, matching LightBurn's
 * `<XForm>` element: `x' = a*x + c*y + tx`, `y' = b*x + d*y + ty`.
 */
export type Mat = [number, number, number, number, number, number];

/** The identity transform — no translation, rotation, or scale. */
export const IDENTITY: Mat = [1, 0, 0, 1, 0, 0];

/** Composes two transforms: applies `n` first, then `m`. */
export function multiply(m: Mat, n: Mat): Mat {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

/** A translation transform by `(tx, ty)`. */
export function translation(tx: number, ty: number): Mat {
  return [1, 0, 0, 1, tx, ty];
}

/** A rotation transform of `deg` degrees clockwise around the origin. */
export function rotation(deg: number): Mat {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [cos, sin, -sin, cos, 0, 0];
}

/** Mirrors the Y axis about `height` — flips Y-down content to Y-up. */
export function flipYMatrix(height: number): Mat {
  return [1, 0, 0, -1, 0, height];
}

/** Applies transform `m` to the point `(x, y)`. */
export function applyToPoint(m: Mat, x: number, y: number): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}
