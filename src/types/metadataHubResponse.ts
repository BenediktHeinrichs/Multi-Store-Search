export interface MetadataHubResponse {
  id: string;
  datacite: Datacite;
  attributes: [];
  elements: Element[];
  header: [];
}

export interface Datacite {
  identifiers: [];
  creators: [];
  titles: Title[];
  publisher: string;
  subjects: [];
  contributors: [];
  dates: [];
  alternateIdentifiers: [];
  relatedIdentifiers: [];
  sizes: [];
  formats: [];
  rightsList: [];
  descriptions: [];
  geoLocations: [];
  fundingReferences: [];
  additionalProperties: object;
}

export interface Title {
  title: string;
  titleType: string;
  additionalProperties: object;
}

export interface Element {
  id: string;
  value: string;
}
