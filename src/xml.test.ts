import { describe, expect, it } from 'vitest';
import { escapeXml, fmt, xform } from './xml';
import { IDENTITY } from './matrix';

describe('escapeXml', () => {
  it('escapes XML special characters', () => {
    expect(escapeXml('Tom & "Jerry"')).toBe('Tom &amp; &quot;Jerry&quot;');
  });

  it('normalizes literal newlines to &#10;', () => {
    expect(escapeXml('First\nSecond')).toBe('First&#10;Second');
  });

  it('normalizes CRLF and lone CR to &#10;', () => {
    expect(escapeXml('First\r\nSecond')).toBe('First&#10;Second');
    expect(escapeXml('First\rSecond')).toBe('First&#10;Second');
  });
});

describe('fmt', () => {
  it('trims trailing zeros', () => {
    expect(fmt(20)).toBe('20');
    expect(fmt(1.5)).toBe('1.5');
  });
});

describe('xform', () => {
  it('serializes the identity matrix', () => {
    expect(xform(IDENTITY)).toBe('<XForm>1 0 0 1 0 0</XForm>');
  });
});
