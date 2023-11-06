/* Coscine */
export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface Daum {
  uri: string;
  type: string;
  source: Record<string, unknown> & { title: string };
}

export interface CoscineSearchResult {
  pagination: Pagination;
  data: Daum[];
  statusCode: number;
  isSuccess: boolean;
  traceId: string;
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
