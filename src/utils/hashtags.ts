/**
 * Safely parses and decodes hashtags which may be stored as hex-encoded BLOBs (0x5b...),
 * JSON strings, arrays, or raw text.
 */
export function parseHashtags(input: any): string[] {
  if (!input) return [];

  let text = input;

  // Handle Buffer
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(text)) {
    text = text.toString('utf-8');
  }

  // Handle Hex encoded string (e.g. 0x5b2273616c6164...)
  if (typeof text === 'string' && text.startsWith('0x')) {
    try {
      const hexStr = text.slice(2);
      text = Buffer.from(hexStr, 'hex').toString('utf-8');
    } catch (err) {
      // ignore hex decode error
    }
  }

  // Handle JSON array string
  if (typeof text === 'string') {
    text = text.trim();
    if (text.startsWith('[') && text.endsWith(']')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch (err) {
        // ignore JSON parse error
      }
    } else if (text) {
      return [text];
    }
  }

  if (Array.isArray(text)) {
    return text.map((item) => String(item).trim()).filter(Boolean);
  }

  return [];
}

/**
 * Formats parsed hashtags into a clean readable string (e.g. "#salad, #midwest, #recipe")
 */
export function formatHashtags(input: any, prefixHashtag = true): string {
  const tags = parseHashtags(input);
  if (tags.length === 0) return '';
  if (prefixHashtag) {
    return tags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(', ');
  }
  return tags.join(', ');
}
