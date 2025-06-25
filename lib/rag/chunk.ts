export function chunkText(text: string, chunkSize = 300): string[] {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  const chunks: string[] = [];
  let chunk = '';

  for (const sentence of sentences) {
    if ((chunk + sentence).length > chunkSize) {
      chunks.push(chunk);
      chunk = sentence;
    } else {
      chunk += sentence;
    }
  }

  if (chunk) chunks.push(chunk);
  return chunks;
}
