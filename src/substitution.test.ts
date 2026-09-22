import { describe, expect, it } from 'vitest';
import { assertLbrn2Format, extractLbrn2Tokens, renderLbrn2File } from './substitution';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<LightBurnProject AppVersion="1.0.00" FormatVersion="1">
  <Shape Type="Text" Str="Hello {{FirstName}} {{LastName}}" />
</LightBurnProject>`;

describe('assertLbrn2Format', () => {
  it('accepts a valid .lbrn2 document', () => {
    expect(() => assertLbrn2Format(SAMPLE_XML)).not.toThrow();
  });

  it('accepts a document with no XML declaration', () => {
    expect(() => assertLbrn2Format('<LightBurnProject></LightBurnProject>')).not.toThrow();
  });

  it('throws for a document with the wrong root element', () => {
    expect(() => assertLbrn2Format('<svg></svg>')).toThrow(/Not a valid \.lbrn2 file/);
  });

  it('throws for non-XML content', () => {
    expect(() => assertLbrn2Format('not xml at all')).toThrow(/Not a valid \.lbrn2 file/);
  });
});

describe('extractLbrn2Tokens', () => {
  it('returns unique bare token names', () => {
    expect(extractLbrn2Tokens(SAMPLE_XML).sort()).toEqual(['FirstName', 'LastName']);
  });

  it('returns each token once even if it appears multiple times', () => {
    const xml = '{{Name}} says hello, {{Name}}!';
    expect(extractLbrn2Tokens(xml)).toEqual(['Name']);
  });

  it('returns an empty array when there are no tokens', () => {
    expect(extractLbrn2Tokens('<LightBurnProject></LightBurnProject>')).toEqual([]);
  });
});

describe('renderLbrn2File', () => {
  it('substitutes tokens with supplied values', () => {
    const output = renderLbrn2File(
      SAMPLE_XML,
      [{ token: 'FirstName' }, { token: 'LastName' }],
      { FirstName: 'Jane', LastName: 'Smith' }
    );
    expect(output).toContain('Str="Hello Jane Smith"');
  });

  it('falls back to defaultValue when no value is supplied', () => {
    const output = renderLbrn2File(
      '{{Name}}',
      [{ token: 'Name', defaultValue: 'Guest' }],
      {}
    );
    expect(output).toBe('Guest');
  });

  it('falls back to an empty string when there is no value or default', () => {
    const output = renderLbrn2File('{{Name}}', [{ token: 'Name' }], {});
    expect(output).toBe('');
  });

  it('replaces every occurrence of a repeated token', () => {
    const output = renderLbrn2File(
      '{{Name}} and {{Name}} again',
      [{ token: 'Name' }],
      { Name: 'Jane' }
    );
    expect(output).toBe('Jane and Jane again');
  });

  it('escapes regex special characters in the token name', () => {
    const output = renderLbrn2File(
      '{{price($)}}',
      [{ token: 'price($)' }],
      { 'price($)': '10' }
    );
    expect(output).toBe('10');
  });

  it('leaves unrelated text untouched', () => {
    const output = renderLbrn2File(SAMPLE_XML, [{ token: 'FirstName' }], { FirstName: 'Jane' });
    expect(output).toContain('AppVersion="1.0.00"');
    expect(output).toContain('{{LastName}}');
  });
});
