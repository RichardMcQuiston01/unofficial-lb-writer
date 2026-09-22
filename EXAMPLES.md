# EXAMPLES

## A minimal project: one rectangle

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

console.log(project.toXml());
```

## Placing and rotating a shape

Shapes are positioned with LightBurn's own affine `<XForm>` matrices.
Compose one from the exported matrix helpers — translate to a position,
then rotate, then (for rect/ellipse/bitmap) translate to the shape's
own center, since their local coordinates are centered on the origin:

```ts
import {
  createLbrn2Project,
  multiply,
  rotation,
  translation,
} from '@richardmcquiston01/unofficial-lb-writer';

const project = createLbrn2Project();
const cutIndex = project.addCutSetting({
  name: 'Engrave',
  type: 'Scan',
  maxPower: 50,
  speed: 300,
});

const width = 20;
const height = 10;
const m = multiply(
  translation(50, 25), // position on the bed, mm
  multiply(rotation(45), translation(width / 2, height / 2))
);

project.addRect(cutIndex, m, width, height, 0);
```

## Multiple layers with different operations

Each call to `addCutSetting` appends a new `CutSetting` and returns its
index — call it once per distinct operation, then reference that index
from every shape on that layer:

```ts
import { createLbrn2Project, IDENTITY } from '@richardmcquiston01/unofficial-lb-writer';

const project = createLbrn2Project();

const engraveIndex = project.addCutSetting({
  name: 'Engrave',
  type: 'Scan',
  maxPower: 50,
  speed: 300,
});
const cutIndex = project.addCutSetting({
  name: 'Cut',
  type: 'Cut',
  maxPower: 80,
  speed: 10,
});

project.addText(engraveIndex, IDENTITY, 'Hello', 'Arial', 10, {
  align: 'center',
});
project.addEllipse(cutIndex, IDENTITY, 15, 15);

const xml = project.toXml();
```

## Embedding a bitmap

```ts
import { createLbrn2Project, IDENTITY } from '@richardmcquiston01/unofficial-lb-writer';

const project = createLbrn2Project();
const imageIndex = project.addImageCutSetting();

// base64 PNG bytes, no `data:image/png;base64,` prefix
project.addBitmap(imageIndex, IDENTITY, 100, 50, '...');

const xml = project.toXml();
```

## Filling in a template's `{{token}}` placeholders

Reading and substituting into an *existing* `.lbrn2` file (e.g. one built
with a `{{FirstName}}`-style placeholder in a text shape's `Str`
attribute) doesn't use the builder at all -- these functions work
directly on the raw XML string:

```ts
import {
  assertLbrn2Format,
  extractLbrn2Tokens,
  renderLbrn2File,
} from '@richardmcquiston01/unofficial-lb-writer';

const xml = await fetch('/templates/name-tag.lbrn2').then((r) => r.text());

assertLbrn2Format(xml); // throws if invalid

const tokens = extractLbrn2Tokens(xml);
// => ['FirstName', 'LastName']

const output = renderLbrn2File(
  xml,
  [
    { token: 'FirstName', defaultValue: 'Guest' },
    { token: 'LastName' },
  ],
  { FirstName: 'Jane', LastName: 'Smith' }
);
// output is the same XML with {{FirstName}} -> 'Jane', {{LastName}} -> 'Smith'
```
