# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-18

### Added

- `applyMatrix(matrix, options?)` to apply a raw 20-coefficient `feColorMatrix` string with the same intensity interpolation as built-in presets.
- Built-in **Fun** presets: `fun/sepia`, `fun/invert`.
- `FilterState.customMatrix` when a custom matrix from `applyMatrix` is active.

### Changed

- **Breaking:** Preset ids are now namespaced (e.g. `visual/grayscale`, `simulateColorBlindness/protanopia`). Legacy flat names such as `grayscale` or `simulate-protanopia` are no longer accepted.
- Filter definitions live under [`src/filters/`](src/filters/) by category (`visual`, `simulateColorBlindness`, `daltonizeColorBlindness`, `fun`).
