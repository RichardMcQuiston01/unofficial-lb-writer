import { describe, expect, it } from 'vitest';
import { bitmapShape, ellipseShape, pathShape, rectShape, textShape } from './shapes';
import { IDENTITY, translation, type Mat } from './matrix';

describe('rectShape', () => {
  it('serializes W/H/Cr and the positioning XForm', () => {
    const m: Mat = [1, 0, 0, -1, 20, 35];
    const xml = rectShape(0, m, 20, 10, 0);
    expect(xml).toBe(
      '<Shape Type="Rect" CutIndex="0" W="20" H="10" Cr="0"><XForm>1 0 0 -1 20 35</XForm></Shape>'
    );
  });
});

describe('ellipseShape', () => {
  it('serializes Rx/Ry and the positioning XForm', () => {
    const m: Mat = [1, 0, 0, 1, 30, 20];
    const xml = ellipseShape(0, m, 10, 5);
    expect(xml).toContain('Rx="10" Ry="5"');
    expect(xml).toContain('<XForm>1 0 0 1 30 20</XForm>');
  });
});

describe('pathShape', () => {
  it('emits absolute vertices with an identity XForm', () => {
    const xml = pathShape(0, translation(10, 10), [0, 0, 20, 0]);
    expect(xml).toContain(IDENTITY.join(' '));
    expect(xml).toContain('<V vx="10" vy="10"/>');
    expect(xml).toContain('<V vx="30" vy="10"/>');
    expect(xml).toContain('<P T="L" p0="0" p1="1"/>');
  });

  it('rejects an odd-length points array', () => {
    expect(() => pathShape(0, IDENTITY, [0, 0, 20])).toThrow(
      'points must contain complete x/y coordinate pairs'
    );
  });
});

describe('textShape', () => {
  it('writes letter spacing into the LS attribute', () => {
    const xml = textShape(0, IDENTITY, 'Spaced', 'Arial', 8, {
      letterSpacing: 1.5,
      align: 'center',
    });
    expect(xml).toContain('LS="1.5"');
  });

  it('writes extra line spacing into the LnS attribute and encodes newlines', () => {
    const xml = textShape(0, IDENTITY, 'First\nSecond', 'Arial', 10, {
      lineSpacing: 2,
      align: 'center',
    });
    expect(xml).toContain('Str="First&#10;Second"');
    expect(xml).toContain('LnS="2"');
  });

  it('un-mirrors a reflected anchor matrix so text stays upright', () => {
    // Anchor (50, 10) flipped about height 50 → (50, 40), reflected.
    const reflected: Mat = [1, 0, 0, -1, 50, 40];
    const xml = textShape(0, reflected, 'Upright', 'Arial', 8, {
      align: 'center',
    });
    expect(xml).toContain('<XForm>1 0 0 1 50 40</XForm>');
    expect(xml).not.toContain('<XForm>1 0 0 -1 50 40</XForm>');
  });

  it('escapes text and maps alignment to the Ah anchor code', () => {
    const xml = textShape(0, IDENTITY, 'Tom & "Jerry"', 'Arial', 8, {
      align: 'center',
    });
    expect(xml).toContain('Str="Tom &amp; &quot;Jerry&quot;"');
    expect(xml).toContain('Ah="1"');
    expect(xml).toContain('H="8"');
  });

  it('defaults align to left (Ah=0)', () => {
    const xml = textShape(0, IDENTITY, 'Left', 'Arial', 8);
    expect(xml).toContain('Ah="0"');
  });
});

describe('bitmapShape', () => {
  it('embeds base64 data and un-mirrors a reflected matrix', () => {
    // Background filling a 100x50mm doc, flipped about height 50.
    const reflected: Mat = [1, 0, 0, -1, 50, 25];
    const xml = bitmapShape(1, reflected, 100, 50, 'PNGDATA');
    expect(xml).toContain('CutIndex="1" W="100" H="50"');
    expect(xml).toContain('Data="PNGDATA"');
    expect(xml).toContain('<XForm>1 0 0 1 50 25</XForm>');
  });

  it('escapes a Data value that could break out of the attribute', () => {
    const xml = bitmapShape(0, IDENTITY, 10, 10, '"><Injected/>');
    expect(xml).toContain('Data="&quot;&gt;&lt;Injected/&gt;"');
    expect(xml).not.toContain('Data=""><Injected/>"');
  });
});
