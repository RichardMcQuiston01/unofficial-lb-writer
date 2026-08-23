# CHANGELOG

## [Unreleased]

### Added

- Initial `.lbrn2` (LightBurn) project builder: `createLbrn2Project()`,
  with `addCutSetting`/`addImageCutSetting`, `addRect`/`addEllipse`/
  `addPath`/`addText`/`addBitmap`, and `toXml()`.
- Affine matrix utilities (`multiply`, `translation`, `rotation`,
  `flipYMatrix`, `applyToPoint`) for composing LightBurn `<XForm>`
  placements.
- Package scaffolding: dual ESM/CJS build via tsup, TypeScript types,
  Vitest test suite.

## [0.0.0] - 2026-08-15

### Added

- Initial repository scaffold (README, LICENSE, COPYRIGHT).
