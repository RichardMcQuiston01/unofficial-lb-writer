# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@richardmcquiston01/unofficial-lb-writer` is an unofficial, framework-agnostic TypeScript NPM package for writing LightBurn-compatible files (the `.lbrn`/`.lbrn2` project file format used by LightBurn laser cutter/engraver software).

## Current State

The package has a working `.lbrn2` (LightBurn) project builder in `src/`:

- `src/matrix.ts` — affine matrix helpers (`Mat`, `multiply`, `translation`, `rotation`, `flipYMatrix`, `applyToPoint`), intrinsic to the `.lbrn2` format since every shape is placed via a raw `<XForm>` matrix.
- `src/xml.ts` — `escapeXml`, `fmt`, `xform` low-level XML helpers.
- `src/shapes.ts` — `rectShape`/`ellipseShape`/`pathShape`/`textShape`/`bitmapShape`, each taking a pre-composed `Mat`. `textShape`/`bitmapShape` own LightBurn's "un-mirror when the composed matrix reflects" quirk.
- `src/project.ts` — `createLbrn2Project()`, a stateful builder: `addCutSetting`/`addImageCutSetting` register settings and return the index shapes should reference (no dedup/reordering — that's the caller's job); `addRect`/`addEllipse`/`addPath`/`addText`/`addBitmap` append shapes; `toXml()` serializes.
- `src/index.ts` — public exports.

Build via `tsup` (dual ESM/CJS + `.d.ts`), tests via `vitest`, colocated as `*.test.ts` next to each source file. License is Apache-2.0 (matches `LICENSE`).

This package is deliberately a **generic, low-level format writer** — it knows nothing about any particular application's document model. The consuming app (e.g. `maker-toolkit`) is expected to keep its own adapter layer that maps its domain types onto this builder's API (compose transforms, resolve layers/business rules, then call `addRect`/`addText`/etc.), the same way `maker-toolkit` already does for `@richardmcquiston01/unofficial-xcs-writer`.

## Repository Conventions

- Keep `CHANGELOG.md` updated with every commit (per user's global instructions).
- Keep `README.md` updated with every feature addition or change (per user's global instructions).
- Documented usage examples belong in `EXAMPLES.md`, referenced from `README.md`.
- Branches: `main` (release), `dev` (current working branch), `staging`/`release` also exist on the remote — per the `git-workflow` skill, work on `dev`, PR to `staging` for final testing, bump version + `CHANGELOG.md` before a PR to `release`.
- Style (per the `typescript-style` skill): 2-space indent, JSDoc every exported function/type, `*.test.ts` colocated with its source file.
