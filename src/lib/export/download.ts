/**
 * File Download Utility
 *
 * Triggers browser download for generated export files.
 */

/**
 * Downloads content as a file
 *
 * Creates a blob from the content and triggers a browser download.
 *
 * @param content - The file content to download
 * @param filename - Name of the file to download
 * @param mimeType - MIME type of the file (default: text/plain)
 *
 * @example
 * ```ts
 * downloadFile(':root { }', 'palette.css', 'text/css');
 * downloadFile('{}', 'palette.json', 'application/json');
 * ```
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  // Create a blob from the content
  const blob = new Blob([content], { type: mimeType });

  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  // Add to DOM, click, and remove
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up the URL
  URL.revokeObjectURL(url);
}
