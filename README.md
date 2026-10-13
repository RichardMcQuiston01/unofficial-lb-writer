# @richardmcquiston01/unofficial-lb-writer

Unofficial, framework-agnostic TypeScript library for writing
[LightBurn](https://lightburnsoftware.com/)-compatible `.lbrn2` project files.

- **Zero runtime dependencies**
- **Dual ESM/CJS** build with bundled TypeScript types
- **Generic, low-level writer** — knows nothing about your app's document
  model; you map your own types onto its builder API
- **Template support** — read an existing `.lbrn2` file and fill in
  `{{token}}` placeholders

> This project is not affiliated with or endorsed by LightBurn Software.

## Installation

```sh
bun add @richardmcquiston01/unofficial-lb-writer
# or
npm install @richardmcquiston01/unofficial-lb-writer
```

Requires Node.js 20+ or Bun 1.1+, and a project targeting ES2022+.

## Quick start

```ts
import { createLbrn2Project, IDENTITY } from '@richardmcquiston01/unofficial-lb-writer';

const project = createLbrn2Project();

const cutIndex: number = project.addCutSetting({
  name: 'Cut',
  type: 'Cut',
  maxPower: 80,
  speed: 10,
});

project.addRect(cutIndex, IDENTITY, 20, 10, 0);

const lbrn2Xml: string = project.toXml();
```

Save `lbrn2Xml` with a `.lbrn2` extension and open it in LightBurn.

## How it works

1. **Register cut settings.** `addCutSetting` / `addImageCutSetting` each
   return the index that shapes reference. Settings are kept in the order
   added, with no deduplication or reordering — that's up to the caller.
2. **Add shapes**, each placed by a raw affine matrix (LightBurn's
   `<XForm>`).
3. **Serialize** with `toXml()`.

## API

### `createLbrn2Project()`

Returns a builder with these methods:

| Method                                                      | Description                                     |
| ----------------------------------------------------------- | ----------------------------------------------- |
| `addCutSetting({ name, type, maxPower, speed })`            | Vector layer; `type` is `'Cut'` or `'Scan'`.    |
| `addImageCutSetting({ name?, maxPower?, speed?, ditherMode? })` | Image layer (defaults: `Image`, 20, 100, `stucki`). |
| `addRect(cutIndex, m, width, height, cornerRadius)`         | Rectangle centered on the origin of `m`.        |
| `addEllipse(cutIndex, m, radiusX, radiusY)`                 | Ellipse centered on the origin of `m`.          |
| `addPath(cutIndex, m, points)`                              | Polyline from `[x0, y0, x1, y1, …]`.            |
| `addText(cutIndex, m, text, font, fontSizeMm, options?)`    | Text; options: `letterSpacing`, `lineSpacing`, `align`. |
| `addBitmap(cutIndex, m, widthMm, heightMm, base64)`         | Embedded PNG (base64, no `data:` prefix).       |
| `toXml()`                                                   | Serialize to a `.lbrn2` XML string.             |

### Matrix helpers

`Mat` is a row-major affine matrix `[a, b, c, d, tx, ty]`.

| Export                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `IDENTITY`              | No translation, rotation, or scale.            |
| `multiply(m, n)`        | Applies `n` first, then `m`.                   |
| `translation(tx, ty)`   | Translate, in mm.                              |
| `rotation(deg)`         | Rotate clockwise around the origin.            |
| `flipYMatrix(height)`   | Flip a Y-down coordinate space to Y-up.        |
| `applyToPoint(m, x, y)` | Transform a point.                             |

### Template substitution

Work directly on the raw XML string of an existing `.lbrn2` file (they are
plain XML, not ZIP archives).

| Function                                       | Description                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `assertLbrn2Format(xml)`                       | Throws a descriptive error unless the root is `<LightBurnProject>`. |
| `extractLbrn2Tokens(xml)`                      | Returns the unique `{{token}}` names found.                       |
| `renderLbrn2File(xml, variables, values)`      | Replaces tokens; falls back to `defaultValue`, then `''`.         |

```ts
import {
  assertLbrn2Format,
  extractLbrn2Tokens,
  renderLbrn2File,
} from '@richardmcquiston01/unofficial-lb-writer';

const xml: string = await fetch('/templates/name-tag.lbrn2').then((r) => r.text());

assertLbrn2Format(xml); // throws if invalid

const tokens: string[] = extractLbrn2Tokens(xml); // e.g. ['FirstName', 'LastName']

const output: string = renderLbrn2File(
  xml,
  [{ token: 'FirstName', defaultValue: 'Guest' }, { token: 'LastName' }],
  { FirstName: 'Jane', LastName: 'Smith' }
);
```

`renderLbrn2File` is plain text substitution, not XML-aware. LightBurn
re-renders its own fonts from stored text, so there is no glyph outline
data to regenerate. `assertLbrn2Format` is a structural sniff, not full
XML validation.

### Lower-level exports

`rectShape`, `ellipseShape`, `pathShape`, `textShape`, `bitmapShape`
(each taking a pre-composed `Mat`), plus `escapeXml`, `fmt`, and `xform`,
are exported for callers who want to assemble XML themselves.

## Examples

See [EXAMPLES.md](./EXAMPLES.md).

## Development

```sh
bun install
bun run typecheck
bun run test
bun run build
```

## License

Apache-2.0 — see [LICENSE](./LICENSE).

## Support

If this library saved you some reverse-engineering, consider buying me a
coffee. ☕

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
