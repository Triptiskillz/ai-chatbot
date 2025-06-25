import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

// Load and embed text files from the /documents folder
export async function createMemoryStoreFromDocuments(folder = 'lib/documents') {
  const docPath = path.join(process.cwd(), folder);
  const files = await fs.readdir(docPath);

  const allDocs: Document[] = [];

  for (const file of files) {
    if (file.endsWith('.txt')) {
      const filePath = path.join(docPath, file);
      const text = await fs.readFile(filePath, 'utf-8');

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });

      const chunks = await splitter.createDocuments([text], [{ source: file }] );

      allDocs.push(...chunks);
    }
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'embedding-001',
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(allDocs, embeddings);

  return vectorStore;
}
