import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';


export async function askWithContext(question: string, store: any) {
  console.log('[askWithContext] Received question:', question);

  const results = await store.similaritySearch(question, 4);

  const context = results.map(doc => doc.pageContent).join('\n\n---\n\n');

  const prompt = new PromptTemplate({
    inputVariables: ['context', 'question'],
    template: `You are a helpful assistant.

        Use the following context to answer the question. If you don't know, say you don't know.

        Context:
        {context}

        Question: {question}
        Answer:`,
  });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Missing GOOGLE_API_KEY env variable');

  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    apiKey,
    temperature: 0.7,
  });

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  let response = await chain.invoke({ context, question });

  return {
    answer: response,
      sources: [...new Set(results.map((doc: any) => doc.metadata.source))],
  };
}
