/**
 * Parse a function string into an executable function
 * @param {string} funcString - The function string (e.g., "t => Math.sin(t)")
 * @returns {Function} - The parsed function
 */
export function parseFunction(funcString) {
  try {
    let body = funcString.trim();
    if (body.startsWith('t =>')) {
      body = body.slice(4).trim();
    } else if (body.startsWith('t=>')) {
      body = body.slice(3).trim();
    }
    return new Function('t', `return ${body};`);
  } catch (e) {
    throw new Error(`Invalid function: ${e.message}`);
  }
}

