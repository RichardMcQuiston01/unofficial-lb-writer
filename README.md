# @richardmcquiston01/unofficial-lb-writer

## Overview

Unofficial framework-agnostic TypeScript npm package for writing LightBurn-compatible files

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.1+
- A TypeScript or JavaScript project targeting ES2022+

### Installation

```sh
bun add @richardmcquiston01/unofficial-lb-writer
```

### Usage

```ts
import { createLbrn2Project, IDENTITY } from '@richardmcquiston01/unofficial-lb-writer';

const project = createLbrn2Project();

const cutIndex = project.addCutSetting({
  name: 'Cut',
  type: 'Cut',
  maxPower: 80,
  speed: 10,
});

project.addRect(cutIndex, IDENTITY, 20, 10, 0);

const lbrn2Xml = project.toXml();
```

`createLbrn2Project()` returns a builder that mirrors the shapes in a
`.lbrn2` project: register `CutSetting`s with `addCutSetting`/
`addImageCutSetting` (each call returns the index shapes should
reference), add shapes with `addRect`/`addEllipse`/`addPath`/`addText`/
`addBitmap`, then call `toXml()` to serialize. Shape placement uses
LightBurn's own affine `<XForm>` matrices — compose one with the
exported `multiply`/`translation`/`rotation`/`flipYMatrix` helpers.

### Reading and substituting into an existing `.lbrn2` file

```ts
import {
  assertLbrn2Format,
  extractLbrn2Tokens,
  renderLbrn2File,
} from '@richardmcquiston01/unofficial-lb-writer';

const xml = await fetch('/templates/name-tag.lbrn2').then((r) => r.text());

assertLbrn2Format(xml); // throws if invalid

const tokens = extractLbrn2Tokens(xml); // e.g. ['FirstName', 'LastName']

const output = renderLbrn2File(
  xml,
  [{ token: 'FirstName', defaultValue: 'Guest' }, { token: 'LastName' }],
  { FirstName: 'Jane', LastName: 'Smith' }
);
```

`.lbrn2` files are plain XML text (not a ZIP archive), so these functions
work directly on strings. `renderLbrn2File` does plain text substitution
on the raw XML -- LightBurn re-renders its own fonts from stored text, so
unlike xTool Studio's `.xcs`/`.xs` there's no glyph outline data to
regenerate when text changes.

### Examples

See [EXAMPLES.md](./EXAMPLES.md)

## License

APACHE 2 - See [LICENSE](./LICENSE)

## Support

If this library saved you some reverse-engineering, consider buying me a coffee. ☕

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
