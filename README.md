# colourability

Zero-dependency TypeScript library that applies **grayscale**, **color-blindness simulation**, and **daltonization** to any webpage using a single SVG [`feColorMatrix`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix) on the document root. Works over `<video>`, `<canvas>`, WebGL, and normal DOM content.

## Install

```bash
npm install colourability
```

## Usage

```typescript
import Colourability from 'colourability';

const colourability = new Colourability();

colourability.apply('daltonize-deuteranopia', { intensity: 1 });
colourability.setIntensity(0.7);
colourability.remove();
```

### Presets

| Name | Description |
|------|-------------|
| `grayscale` | BT.709 luminance |
| `simulate-protanopia` | Red-cone (L) deficiency — simulation |
| `simulate-deuteranopia` | Green-cone (M) deficiency — simulation |
| `simulate-tritanopia` | Blue-cone (S) deficiency — simulation (Machado-style matrix) |
| `daltonize-protanopia` | Compensation heuristic (`2I − M_sim`) |
| `daltonize-deuteranopia` | Compensation heuristic |
| `daltonize-tritanopia` | Compensation heuristic |

`intensity` is in `0…1` (matrix interpolation toward identity).

### API

- `apply(name, options?)` — inject/update SVG filter and set `filter: url(#__colourability-active__)` on `<html>`
- `remove()` — remove SVG and restore the previous `filter` style
- `setIntensity(value)` — adjust strength while a filter is active
- `list()` — built-in preset names
- `getState()` — `{ active, options }`

### Browser script (IIFE / UMD)

After building, load `dist/colourability.min.js` and use the global `Colourability` constructor (see `package.json` `exports`).

## How it works

A hidden `<svg>` in `<head>` defines `<filter id="__colourability-active__">` with `color-interpolation-filters="linearRGB"`. The root element’s `filter` CSS property references that id. There is **no** full-screen overlay `<div>`; pointer events are unchanged.

## License

MIT
