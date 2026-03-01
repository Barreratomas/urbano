// Polyfill process for browser environment
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}
export {};
