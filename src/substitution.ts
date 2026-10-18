const TOKEN_RE = /\{\{([^}]+)\}\}/g;

/** A `{{token}}` placeholder to substitute in a `.lbrn2` file's raw XML. */
export interface Lbrn2Variable {
  /** Token name without braces, e.g. `"LastName"` for a `{{LastName}}` placeholder. */
  token: string;
  defaultValue?: string;
}

/**
 * Validates that `xmlContent` looks like a `.lbrn2` file -- specifically,
 * that its root element (ignoring an optional leading `<?xml ... ?>`
 * declaration) is `<LightBurnProject>`. This is a structural sniff, not
 * full XML validation: it doesn't parse the document or check any other
 * element. Throws a descriptive error otherwise.
 */
export function assertLbrn2Format(xmlContent: string): void {
  const withoutDeclaration = xmlContent.trimStart().replace(/^<\?xml[^>]*\?>\s*/, '');
  if (!withoutDeclaration.startsWith('<LightBurnProject')) {
    throw new Error('Not a valid .lbrn2 file: missing <LightBurnProject> root element.');
  }
}

/**
 * Scans a `.lbrn2` file's raw XML for `{{token}}` placeholders and
 * returns the unique token names found, without braces.
 */
export function extractLbrn2Tokens(xmlContent: string): string[] {
  const seen = new Set<string>();
  for (const match of xmlContent.matchAll(TOKEN_RE)) {
    seen.add(match[1]);
  }
  return Array.from(seen);
}

/** Escapes `text` for literal use inside a `RegExp`. */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Substitutes `{{token}}` placeholders in a `.lbrn2` file's raw XML and
 * returns the modified content. Tokens with no matching entry in
 * `values` fall back to `variable.defaultValue`, or an empty string if
 * no default is set.
 *
 * Replacement is a single pass and values are inserted literally: `$&`,
 * `$'`, `` $` `` and `$$` are not expanded, and text inserted for one
 * variable is never scanned for another variable's placeholder. Variables
 * with an empty token are ignored; placeholders with no matching variable
 * are left as they are.
 *
 * This is plain text substitution, not XML-aware -- values are inserted
 * as-is, so callers must escape them (see `escapeXml`) if they may contain
 * `&`, `<`, `>`, or `"`. LightBurn re-renders its own fonts from whatever
 * text is stored, so (unlike xTool Studio) there's no glyph outline data
 * to regenerate when text changes.
 */
export function renderLbrn2File(
  xmlContent: string,
  variables: Lbrn2Variable[],
  values: Record<string, string>
): string {
  const replacementByPlaceholder = new Map<string, string>();
  for (const variable of variables) {
    if (!variable.token) continue;
    replacementByPlaceholder.set(
      `{{${variable.token}}}`,
      values[variable.token] ?? variable.defaultValue ?? ''
    );
  }
  if (replacementByPlaceholder.size === 0) return xmlContent;

  const pattern = new RegExp(
    Array.from(replacementByPlaceholder.keys()).map(escapeRegExp).join('|'),
    'g'
  );
  return xmlContent.replace(
    pattern,
    (placeholder) => replacementByPlaceholder.get(placeholder) ?? placeholder
  );
}
