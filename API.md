# API Reference

[Back to README](./README.md)

| [Project Builder](#project-builder) | [Matrix Helpers](#matrix-helpers) | [Template Functions](#template-functions) | [Lower-Level Exports](#lower-level-exports) |

## Project Builder

`createLbrn2Project()` returns a builder with these methods:

| Method                                                          | Description                                            |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| `addCutSetting({ name, type, maxPower, speed })`                | Adds a vector layer. `type` is `'Cut'` or `'Scan'`.    |
| `addImageCutSetting({ name?, maxPower?, speed?, ditherMode? })` | Adds an image layer. Defaults: `Image`, 20, 100, `stucki`. |
| `addRect(cutIndex, m, width, height, cornerRadius)`             | Adds a rectangle centered on the origin of `m`.        |
| `addEllipse(cutIndex, m, radiusX, radiusY)`                     | Adds an ellipse centered on the origin of `m`.         |
| `addPath(cutIndex, m, points)`                                  | Adds a path from `[x0, y0, x1, y1, …]`.                |
| `addText(cutIndex, m, text, font, fontSizeMm, options?)`        | Adds text. Options: `letterSpacing`, `lineSpacing`, `align`. |
| `addBitmap(cutIndex, m, widthMm, heightMm, base64)`             | Adds an embedded PNG. Use base64 with no `data:` prefix. |
| `toXml()`                                                       | Returns the project as a `.lbrn2` XML string.          |

Both `add...CutSetting` methods return the index that shapes use as `cutIndex`.

[Back to Top](#api-reference)

## Matrix Helpers

`Mat` is a row-major affine matrix: `[a, b, c, d, tx, ty]`.

| Export                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `IDENTITY`              | No move, turn, or scale.                 |
| `multiply(m, n)`        | Applies `n` first, then `m`.             |
| `translation(tx, ty)`   | Moves a shape, in millimeters.           |
| `rotation(deg)`         | Turns a shape clockwise around the origin. |
| `flipYMatrix(height)`   | Flips a Y-down space to Y-up.            |
| `applyToPoint(m, x, y)` | Moves one point with a matrix.           |

[Back to Top](#api-reference)

## Template Functions

These work on the raw XML text of an existing `.lbrn2` file. A `.lbrn2` file is plain XML, not a ZIP archive.

| Function                                  | Description                                                    |
| ----------------------------------------- | -------------------------------------------------------------- |
| `assertLbrn2Format(xml)`                  | Throws an error unless the root element is `<LightBurnProject>`. |
| `extractLbrn2Tokens(xml)`                 | Returns each `{{token}}` name found, once.                     |
| `renderLbrn2File(xml, variables, values)` | Replaces tokens. Uses `defaultValue` first, then an empty string. |

`renderLbrn2File` swaps plain text. It does not parse the XML. LightBurn draws its own fonts from the stored text, so there is no outline data to rebuild. `assertLbrn2Format` is a quick check of the root element. It is not full XML validation.

[Back to Top](#api-reference)

## Lower-Level Exports

You can build the XML yourself with `rectShape`, `ellipseShape`, `pathShape`, `textShape`, and `bitmapShape`. Each one takes a ready-made `Mat`. The package also exports `escapeXml`, `fmt`, and `xform`.

[Back to Top](#api-reference)

---

[Back to README](./README.md)
