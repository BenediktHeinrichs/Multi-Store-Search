/* Coscine */
export interface CoscineSearchResult {
  graphName: string;
  type: Type;
  source: Record<string, unknown> & { title: string };
}

export enum Type {
  Metadata = "Metadata",
  Project = "Project",
  Resource = "Resource",
}

/* MetaStore */
export interface MetastoreSearchResult {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits {
  total: Total;
  max_score: number;
  hits: Hit[];
}

export interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Source;
}

export interface Source {
  read: string[];
  metadataRecord: Record<string, unknown>;
  metadataDocument: MetadataDocument;
}

export interface MetadataDocument {
  title: string;
}

export interface ACL {
  id: number;
  sid: string;
  permission: string;
}

export interface RelatedResource {
  identifier: string;
  identifierType: string;
}

export interface Total {
  value: number;
  relation: string;
}
