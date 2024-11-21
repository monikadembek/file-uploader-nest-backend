export function sanitizeFileName(fileName: string): string {
  // Remove any directory traversal attempts
  const name = fileName.replace(/^.*[\\\/]/, '');

  // Remove special characters and spaces
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .toLowerCase() // Convert to lowercase
    .trim(); // Remove leading/trailing spaces
}
