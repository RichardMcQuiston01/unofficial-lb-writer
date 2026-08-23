import { describe, expect, it } from 'vitest';
import { applyToPoint, flipYMatrix, multiply, rotation, translation } from './matrix';

describe('matrix helpers', () => {
  it('translates points', () => {
    expect(applyToPoint(translation(10, 5), 1, 2)).toEqual([11, 7]);
  });

  it('rotates points around the origin', () => {
    const [x, y] = applyToPoint(rotation(90), 10, 0);
    expect(x).toBeCloseTo(0, 6);
    expect(y).toBeCloseTo(10, 6);
  });

  it('flips Y about the document height', () => {
    expect(applyToPoint(flipYMatrix(50), 10, 10)).toEqual([10, 40]);
  });

  it('composes transforms right-to-left', () => {
    const m = multiply(translation(10, 0), rotation(90));
    const [x, y] = applyToPoint(m, 5, 0);
    expect(x).toBeCloseTo(10, 6);
    expect(y).toBeCloseTo(5, 6);
  });
});
