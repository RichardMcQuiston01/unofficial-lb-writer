# CHANGELOG

## [Unreleased]

## [0.2.2] - 2026-10-18

### Fixed

- `renderLbrn2File` now substitutes in a single pass and inserts values
  literally. Previously `$&`, `$'`, `` $` `` and `$$` in a value were
  expanded as `String.prototype.replace` patterns (so `$'` copied the rest
  of the file into the output), and a value inserted for one variable was
  scanned again for later variables' `{{token}}` placeholders. Variables
  with an empty token are now ignored.

### Changed

- Documented that `renderLbrn2File` does not XML-escape values; callers
  should pass them through `escapeXml` first when they may contain `&`,
  `<`, `>`, or `"`.

## [0.2.1] - 2026-10-13

### Changed

- Rewrote `README.md` to the standard template: author block, Table of
  Contents, Back to Top links, and the standard Buy Me a Coffee, License,
  and Copyright sections.
- `EXAMPLES.md` now has Back to README links, a menu row, and Back to Top
  links.
- `API.md` is now included in the published package so the README link
  works on npm.

### Added

- `API.md`: reference tables for the project builder, matrix helpers,
  and template functions, linked from the README.

## [0.2.0] - 2026-09-22

### Added

- A `prepare` script (`tsup`) so installing this package directly from
  its git URL (before it's published to npm) builds `dist/`
  automatically instead of shipping raw TypeScript source.
- **Read/extract/substitute API** for existing `.lbrn2` files (`src/substitution.ts`):
  `assertLbrn2Format`, `extractLbrn2Tokens`, `renderLbrn2File`, and the
  `Lbrn2Variable` type, mirroring `@richardmcquiston01/unofficial-xcs-writer`'s
  `.xcs` functions. This is plain text substitution over the raw XML string
  (LightBurn re-renders its own fonts, so unlike `.xcs` there's no glyph
  outline data to regenerate) and `assertLbrn2Format` is a lightweight
  structural sniff rather than full XML parsing -- this package still has
  zero runtime dependencies.

## [0.1.0] - 2026-09-19

### Added

- A `prepare` script (`tsup`) so installing this package directly from
  its git URL (before it's published to npm) builds `dist/`
  automatically instead of shipping raw TypeScript source.
- **Read/extract/substitute API** for existing `.lbrn2` files (`src/substitution.ts`):
  `assertLbrn2Format`, `extractLbrn2Tokens`, `renderLbrn2File`, and the
  `Lbrn2Variable` type, mirroring `@richardmcquiston01/unofficial-xcs-writer`'s
  `.xcs` functions. This is plain text substitution over the raw XML string
  (LightBurn re-renders its own fonts, so unlike `.xcs` there's no glyph
  outline data to regenerate) and `assertLbrn2Format` is a lightweight
  structural sniff rather than full XML parsing -- this package still has
  zero runtime dependencies.

## [0.1.0] - 2026-09-19

### Added

- Initial `.lbrn2` (LightBurn) project builder: `createLbrn2Project()`,
  with `addCutSetting`/`addImageCutSetting`, `addRect`/`addEllipse`/
  `addPath`/`addText`/`addBitmap`, and `toXml()`.
- Affine matrix utilities (`multiply`, `translation`, `rotation`,
  `flipYMatrix`, `applyToPoint`) for composing LightBurn `<XForm>`
  placements.
- Package scaffolding: dual ESM/CJS build via tsup, TypeScript types,
  Vitest test suite.

### Fixed

- `escapeXml` now normalizes CRLF and lone `\r` to `&#10;`, not just LF.
- `bitmapShape`'s `Data` attribute and `addImageCutSetting`'s
  `ditherMode` value are now XML-escaped, closing an attribute-breakout
  injection path for untrusted input.
- `pathShape` rejects a `points` array with an odd length instead of
  emitting a `NaN` coordinate.
- `EXAMPLES.md` is now included in the published npm package.
- Hardened `.github/workflows/publish.yml`: `persist-credentials:
  false` on checkout, the release-tag/version check now runs
  unconditionally (closing a `workflow_dispatch` bypass), and
  build/test run in a separate step without `NPM_TOKEN` in scope.

## [0.0.0] - 2026-08-15

### Added

- Initial repository scaffold (README, LICENSE, COPYRIGHT).
