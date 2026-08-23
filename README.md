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
