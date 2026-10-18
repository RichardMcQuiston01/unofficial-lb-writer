# @richardmcquiston01/unofficial-lb-writer

- Author: [Richard McQuiston](mailto:richard.mcquiston@gmail.com)
- Website: https://richardmcquiston.com/

## Table of Contents

| [Overview](#overview) | [Getting Started](#getting-started) | [API Reference](#api-reference) | [Development](#development) | [Buy Me a Coffee](#buy-me-a-coffee) | [License](#license) | [Copyright](#copyright) |

## Overview

This is an unofficial TypeScript package that writes LightBurn project files (`.lbrn2`). LightBurn is software for laser cutters and engravers. This project is not tied to or endorsed by LightBurn Software.

The package is a low-level writer. It knows nothing about your app's document model. You map your own data onto its builder. It has no runtime dependencies and works with any framework. It also fills in `{{token}}` placeholders in an existing `.lbrn2` file.

[Back to Top](#table-of-contents)

## Getting Started

### Prerequisites

- Node.js 20 or newer, or Bun 1.1 or newer
- A TypeScript or JavaScript project that targets ES2022 or newer

### Installation

```sh
bun add @richardmcquiston01/unofficial-lb-writer
```

You can also use `npm install @richardmcquiston01/unofficial-lb-writer`.

### Usage

Create a project, add a cut setting, add a shape, and write the XML.

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

Save the result with a `.lbrn2` extension and open it in LightBurn.

Each cut setting returns an index. Shapes use that index to pick their layer. The package keeps cut settings in the order you add them. It does not remove duplicates. Each shape is placed with a matrix, which is LightBurn's own `<XForm>` format.

To fill in an existing template, use the three template functions:

```ts
import {
  assertLbrn2Format,
  extractLbrn2Tokens,
  renderLbrn2File,
} from '@richardmcquiston01/unofficial-lb-writer';

const xml: string = await fetch('/templates/name-tag.lbrn2').then((r) => r.text());

assertLbrn2Format(xml); // throws if the file is not a .lbrn2 file

const tokens: string[] = extractLbrn2Tokens(xml); // e.g. ['FirstName', 'LastName']

const output: string = renderLbrn2File(
  xml,
  [{ token: 'FirstName', defaultValue: 'Guest' }, { token: 'LastName' }],
  { FirstName: 'Jane', LastName: 'Smith' }
);
```

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

Values are inserted literally in a single pass: `$` sequences are not
expanded, and a value that contains another variable's `{{token}}` is not
substituted again. Values are not XML-escaped, so run them through
`escapeXml` first if they may contain `&`, `<`, `>`, or `"`.

### Examples

See [EXAMPLES.md](./EXAMPLES.md) for more examples. They cover moving and turning shapes, using many layers, adding images, and filling in templates.

[Back to Top](#table-of-contents)

## API Reference

See [API.md](./API.md) for every function, with tables for the project builder, the matrix helpers, and the template functions.

[Back to Top](#table-of-contents)

## Development

Install the packages, then run the checks:

```sh
bun install
bun run typecheck
bun run test
bun run build
```

[Back to Top](#table-of-contents)

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

[Back to Top](#table-of-contents)

## License

Apache 2

[Back to Top](#table-of-contents)

## Copyright

(c)2026 Richard McQuiston. All rights reserved.

[Back to Top](#table-of-contents)
