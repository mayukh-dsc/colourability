const SVG_NS = 'http://www.w3.org/2000/svg';

/** Single shared SVG root in `<head>` (see AGENTS.md). */
export const SVG_ROOT_ID = '__colourability-svg__';

/** Referenced by `document.documentElement.style.filter = url(#...)`. */
export const FILTER_ID = '__colourability-active__';

/**
 * Ensures the hidden SVG exists and sets the active `feColorMatrix` values.
 * Idempotent: updates `values` in place when the SVG already exists.
 */
export function ensureFilterSvg(matrixValues: string, doc: Document): void {
  const existing = doc.getElementById(SVG_ROOT_ID);
  if (existing !== null) {
    const fe = existing.querySelector('feColorMatrix');
    if (fe === null) {
      throw new Error('colourability: feColorMatrix missing inside shared SVG');
    }
    fe.setAttribute('values', matrixValues);
    return;
  }

  const root = doc.createElementNS(SVG_NS, 'svg');
  root.setAttribute('id', SVG_ROOT_ID);
  root.setAttribute('style', 'display:none');
  root.setAttribute('aria-hidden', 'true');

  const defs = doc.createElementNS(SVG_NS, 'defs');
  const filterEl = doc.createElementNS(SVG_NS, 'filter');
  filterEl.setAttribute('id', FILTER_ID);
  filterEl.setAttribute('color-interpolation-filters', 'linearRGB');

  const fe = doc.createElementNS(SVG_NS, 'feColorMatrix');
  fe.setAttribute('type', 'matrix');
  fe.setAttribute('values', matrixValues);

  filterEl.appendChild(fe);
  defs.appendChild(filterEl);
  root.appendChild(defs);

  const head = doc.head;
  if (head === null) {
    throw new Error('colourability: document.head is null');
  }
  head.appendChild(root);
}

export function setMatrixValues(matrixValues: string, doc: Document): void {
  const root = doc.getElementById(SVG_ROOT_ID);
  if (root === null) {
    throw new Error('colourability: SVG not injected');
  }
  const fe = root.querySelector('feColorMatrix');
  if (fe === null) {
    throw new Error('colourability: feColorMatrix missing');
  }
  fe.setAttribute('values', matrixValues);
}

export function removeFilterSvg(doc: Document): void {
  doc.getElementById(SVG_ROOT_ID)?.remove();
}
