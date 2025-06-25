import fs from 'fs';
import path from 'path';

export function loadDocumentsFromTxt() {
  const folderPath = path.join(process.cwd(), 'documents');
  const files = fs.readdirSync(folderPath);

  return files.map((fileName, i) => {
    const content = fs.readFileSync(path.join(folderPath, fileName), 'utf-8');
    return {
      id: `doc-${i}`,
      title: fileName.replace('.txt', ''),
      content,
    };
  });
}
