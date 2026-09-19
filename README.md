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
# or
npm install @richardmcquiston01/unofficial-lb-writer
# or
pnpm add @richardmcquiston01/unofficial-lb-writer
# or
yarn add @richardmcquiston01/unofficial-lb-writer
```

Ships dual ESM/CJS builds plus TypeScript `.d.ts` types — no extra
`@types` package needed, and it works from both `import` and
`require`.

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

## Development

```sh
git clone https://github.com/RichardMcQuiston01/unofficial-lb-writer.git
cd unofficial-lb-writer
bun install

bun run build       # dual ESM/CJS build + .d.ts, via tsup -> dist/
bun run dev         # build in watch mode
bun run test        # vitest, *.test.ts colocated with each source file
bun run typecheck   # tsc --noEmit
```

Work happens on `dev`, PRs land on `staging` for final testing, then
`release` before a version bump + tag publishes to npm (see
`.github/workflows/publish.yml`).

## License

APACHE 2 - See [LICENSE](./LICENSE)

## Support

If this library saved you some reverse-engineering, consider buying me a coffee. ☕

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
