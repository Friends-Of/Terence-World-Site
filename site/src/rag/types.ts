export type RagChunk = {
  id: string;
  title: string;
  sourcePath: string;
  routeHint: string;
  text: string;
  tokens: string[];
  embedding?: number[];
};

export type RagIndex = {
  version: number;
  createdAt: string;
  chunks: RagChunk[];
};

export type ChatLink = {
  href: string;
  label: string;
};
