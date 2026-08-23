import type { Mat } from './matrix';

/**
 * Escapes a string for use inside an XML attribute value. Literal
 * newlines are normalized to `&#10;` since XML parsers otherwise
 * collapse them to spaces in attribute values.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\r\n?|\n/g, '&#10;');
}

/** Formats a number the way LightBurn expects: no unnecessary precision. */
export function fmt(value: number): string {
  return Number(value.toFixed(5)).toString();
}

/** Serializes an affine matrix as a LightBurn `<XForm>` element. */
export function xform(m: Mat): string {
  return `<XForm>${m.map(fmt).join(' ')}</XForm>`;
}
