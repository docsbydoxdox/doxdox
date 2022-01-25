import { Doc } from 'doxdox-core';

export default async (doc: Doc): Promise<string> => JSON.stringify(doc);
