# colourability

Zero-dependency TypeScript library that applies **grayscale**, **color-blindness simulation**, **daltonization**, and optional **stylized** matrices to any webpage using a single SVG [`feColorMatrix`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix) on the document root. Works over `<video>`, `<canvas>`, WebGL, and normal DOM content.

## Install

```bash
npm install colourability
```

## Usage

```typescript
import Colourability from 'colourability';

const colourability = new Colourability();

colourability.apply('daltonizeColorBlindness/deuteranopia', { intensity: 1 });
colourability.setIntensity(0.7);
colourability.remove();
```

### Custom matrix

Pass a 20-number `feColorMatrix` `values` string (row-major, same format as built-ins). For example, the identity (no-op) matrix:

```typescript
import Colourability from 'colourability';

const IDENTITY =
  '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0';

const c = new Colourability();
c.applyMatrix(IDENTITY, { intensity: 0.5 });
```

### Presets

Built-in ids use `category/subname`:

| Id | Description |
|----|-------------|
| `visual/grayscale` | BT.709 luminance |
| `simulateColorBlindness/protanopia` | Red-cone (L) deficiency — simulation |
| `simulateColorBlindness/deuteranopia` | Green-cone (M) deficiency — simulation |
| `simulateColorBlindness/tritanopia` | Blue-cone (S) deficiency — simulation (Machado-style matrix) |
| `daltonizeColorBlindness/protanopia` | Compensation heuristic (`2I − M_sim`) |
| `daltonizeColorBlindness/deuteranopia` | Compensation heuristic |
| `daltonizeColorBlindness/tritanopia` | Compensation heuristic |
| `fun/sepia` | Sepia-style RGB mix |
| `fun/invert` | RGB invert with per-channel offset |

`intensity` is in `0…1` (per-coefficient interpolation toward the identity matrix).

### API

- `apply(name, options?)` — inject/update SVG filter and set `filter: url(#__colourability-active__)` on `<html>`
- `applyMatrix(matrix, options?)` — same as `apply`, but with a raw 20-coefficient matrix string
- `remove()` — remove SVG and restore the previous `filter` style
- `setIntensity(value)` — adjust strength while a filter is active (preset or custom matrix)
- `list()` — built-in preset ids
- `getState()` — `{ active, customMatrix, options }` — `active` is set for built-ins; `customMatrix` is set when `applyMatrix` was used

### Versioning (0.x)

While the major version is **0**, minor releases may include breaking API or preset-id changes. Pin the version range you need for production.

### Browser script (IIFE / UMD)

After building, load `dist/colourability.min.js` and use the global `Colourability` constructor (see `package.json` `exports`).

## How it works

A hidden `<svg>` in `<head>` defines `<filter id="__colourability-active__">` with `color-interpolation-filters="linearRGB"`. The root element’s `filter` CSS property references that id. There is **no** full-screen overlay `<div>`; pointer events are unchanged.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
