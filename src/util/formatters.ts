import type { FormattedResults } from "@/types/formattedResults";
import type { MetadataHubResponse } from "@/types/metadataHubResponse";
import type {
  CoscineSearchResult,
  MetastoreSearchResult,
} from "@/types/searchResults";

export const formatResults = (response: string | MetadataHubResponse) => {
  if (typeof response === "string") {
    response = JSON.parse(response) as MetadataHubResponse;
  }
  return response.elements.map((element) => JSON.parse(element.value));
};

export const formatCoscine = (
  results: CoscineSearchResult[][]
): FormattedResults[] => {
  const returnArray: FormattedResults[] = [];
  if (results[0]) {
    for (const result of results[0]) {
      returnArray.push({
        title: `${result.source.title} (${result.graphName})`,
        values: result.source,
      });
    }
  }
  return returnArray;
};

export const formatMetastore = (
  results: MetastoreSearchResult[]
): FormattedResults[] => {
  const returnArray: FormattedResults[] = [];
  const hits = results[0]?.hits?.hits ?? [];
  for (const hit of hits) {
    const source = hit._source;
    returnArray.push({
      title: source.metadataDocument.title,
      values: source.metadataRecord,
    });
  }
  return returnArray;
};

export const formatElse = (results: unknown[]): FormattedResults[] => {
  const returnArray: FormattedResults[] = [];
  for (const resultIndex in results) {
    returnArray.push({
      title: "Result " + resultIndex,
      values: results[resultIndex] as Record<string, unknown>,
    });
  }
  return returnArray;
};

export const formatBasedOnMapping = (
  results: unknown[],
  mapping: string
): FormattedResults[] => {
  switch (mapping) {
    case "Coscine":
      return formatCoscine(results as CoscineSearchResult[][]);
    case "Metastore":
      return formatMetastore(results as MetastoreSearchResult[]);
    default:
      return formatElse(results);
  }
};
