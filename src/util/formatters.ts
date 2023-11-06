import type { FormattedResults } from "@/types/formattedResults";
import type { MetadataHubResponse } from "@/types/metadataHubResponse";
import type {
  CoscineSearchResult,
  MetastoreSearchResult,
} from "@/types/searchResults";
import { parseRDFDefinition } from "./basicLinkedData";

export const formatResults = (response: string | MetadataHubResponse) => {
  if (typeof response === "string") {
    response = JSON.parse(response) as MetadataHubResponse;
  }
  return response.elements.map((element) => JSON.parse(element.value));
};

export const formatAims = async (
  results: string[][],
): Promise<FormattedResults[]> => {
  const returnArray: FormattedResults[] = [];
  if (results[0]) {
    const resultArr = results[0];
    for (const resultIndex in resultArr) {
      const dataset = await parseRDFDefinition(resultArr[resultIndex]);
      const record: Record<string, string> = {};
      dataset.forEach((quad) => {
        record[quad.predicate.value] = quad.object.value;
      });
      returnArray.push({
        title: "Result " + (Number(resultIndex) + 1),
        values: record,
      });
    }
  }
  return returnArray;
};

export const formatCoscine = (
  results: CoscineSearchResult[],
): FormattedResults[] => {
  const returnArray: FormattedResults[] = [];
  if (results[0]) {
    for (const result of results[0].data) {
      returnArray.push({
        title: result.source.title ?? result.uri,
        values: result.source,
      });
    }
  }
  return returnArray;
};

export const formatMetastore = (
  results: MetastoreSearchResult[],
): FormattedResults[] => {
  const returnArray: FormattedResults[] = [];
  const hits = results[0]?.hits?.hits ?? [];
  for (const hit of hits) {
    const source = hit._source;
    returnArray.push({
      title: source.metadataDocument.title ?? source.metadataRecord["id"],
      values: source.metadataRecord,
    });
  }
  return returnArray;
};

export const formatElse = (results: unknown[]): FormattedResults[] => {
  const returnArray: FormattedResults[] = [];
  if (results[0] && Array.isArray(results[0])) {
    const resultArr = results[0];
    for (const resultIndex in resultArr) {
      returnArray.push({
        title: "Result " + (Number(resultIndex) + 1),
        values: resultArr[resultIndex] as Record<string, unknown>,
      });
    }
  }
  return returnArray;
};

export const formatBasedOnMapping = async (
  results: unknown[],
  mapping: string,
): Promise<FormattedResults[]> => {
  switch (mapping) {
    case "Aims":
      return await formatAims(results as string[][]);
    case "Coscine":
      return formatCoscine(results as CoscineSearchResult[]);
    case "Metastore":
      return formatMetastore(results as MetastoreSearchResult[]);
    default:
      return formatElse(results);
  }
};
