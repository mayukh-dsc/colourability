# Contributing

Thanks for your interest in **colourability**.

## Development

- Install dependencies: `npm ci`
- Typecheck: `npm run typecheck`
- Tests: `npm test` (coverage: `npm run test:coverage`)
- Build: `npm run build`

## Pull requests

- Keep changes focused and covered by tests.
- Run `npm run typecheck`, `npm run test:coverage`, and `npm run build` before pushing.
- Update `README.md` and `CHANGELOG.md` when the public API or built-in presets change.

## Adding a built-in preset

1. Add the 20-coefficient matrix string in the right file under [`src/filters/`](src/filters/) (or a new category module).
2. Register the namespaced id in [`src/filters/index.ts`](src/filters/index.ts).
3. Extend tests in [`src/__tests__/matrix.test.ts`](src/__tests__/matrix.test.ts) (preset count and validity).

Preset ids should look like `category/subname` (for example `fun/sepia`).
