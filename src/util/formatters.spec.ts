import type { MetadataHubResponse } from "@/types/metadataHubResponse";
import {
  formatResults,
  formatCoscine,
  formatMetastore,
  formatElse,
  formatBasedOnMapping,
} from "./formatters";
import type {
  CoscineSearchResult,
  MetastoreSearchResult,
} from "@/types/searchResults";
import { FormattedResults } from "@/types/formattedResults";

describe("formatResults", () => {
  test("should return formatted results from MetadataHubResponse", () => {
    const response = {
      elements: [
        { value: '{"title": "Title 1", "data": "Data 1"}' },
        { value: '{"title": "Title 2", "data": "Data 2"}' },
      ],
    } as MetadataHubResponse;
    const expected = [
      { title: "Title 1", data: "Data 1" },
      { title: "Title 2", data: "Data 2" },
    ];
    expect(formatResults(response)).toEqual(expected);
  });

  test("should return formatted results from JSON string", () => {
    const response = '{"elements": [{"value": "0"}]}';
    const expected = [0];
    expect(formatResults(response)).toEqual(expected);
  });
});

describe("formatCoscine", () => {
  test("should return formatted results for CoscineSearchResult", () => {
    const results = [
      {
        data: [
          { source: { title: "Title 1" } },
          { source: { title: "Title 2" } },
        ],
      },
    ] as unknown as CoscineSearchResult[];
    const expected = [
      {
        title: "Title 1",
        values: { title: "Title 1" },
      },
      {
        title: "Title 2",
        values: { title: "Title 2" },
      },
    ];
    expect(formatCoscine(results)).toEqual(expected);
  });

  test("should return an empty array if results are empty", () => {
    const results: CoscineSearchResult[] = [];
    const expected: FormattedResults[] = [];
    expect(formatCoscine(results)).toEqual(expected);
  });
});

describe("formatMetastore", () => {
  test("should return formatted results for MetastoreSearchResult", () => {
    const results = [
      {
        hits: {
          hits: [
            {
              _source: {
                metadataDocument: { title: "Title 1" },
                metadataRecord: { data: "Data 1" },
              },
            },
            {
              _source: {
                metadataDocument: { title: "Title 2" },
                metadataRecord: { data: "Data 2" },
              },
            },
          ],
        },
      },
    ] as unknown as MetastoreSearchResult[];
    const expected = [
      {
        title: "Title 1",
        values: {
          data: "Data 1",
        },
      },
      {
        title: "Title 2",
        values: {
          data: "Data 2",
        },
      },
    ];
    expect(formatMetastore(results)).toEqual(expected);
  });

  test("should return an empty array if results are empty", () => {
    const results: MetastoreSearchResult[] = [];
    const expected: FormattedResults[] = [];
    expect(formatMetastore(results)).toEqual(expected);
  });
});

describe("formatElse", () => {
  test("should return formatted results for unknown mapping", () => {
    const results = [
      [
        { title: "Title 1", data: "Data 1" },
        { title: "Title 2", data: "Data 2" },
      ],
    ];
    const expected = [
      { title: "Result 1", values: { title: "Title 1", data: "Data 1" } },
      { title: "Result 2", values: { title: "Title 2", data: "Data 2" } },
    ];
    expect(formatElse(results)).toEqual(expected);
  });

  test("should return an empty array if results are empty", () => {
    const results: unknown[] = [];
    const expected: FormattedResults[] = [];
    expect(formatElse(results)).toEqual(expected);
  });
});

describe("formatBasedOnMapping", () => {
  test("should return formatted results based on mapping", async () => {
    const results = [
      {
        data: [
          { source: { title: "Title 1" } },
          { source: { title: "Title 2" } },
        ],
      },
    ];
    const mapping = "Coscine";
    const expected = [
      {
        title: "Title 1",
        values: { title: "Title 1" },
      },
      {
        title: "Title 2",
        values: { title: "Title 2" },
      },
    ];
    expect(await formatBasedOnMapping(results, mapping)).toEqual(expected);
  });

  test("should return formatted results for Metastore mapping", async () => {
    const results = [
      {
        hits: {
          hits: [
            {
              _source: {
                metadataDocument: { title: "Title 1" },
                metadataRecord: { data: "Data 1" },
              },
            },
            {
              _source: {
                metadataDocument: { title: "Title 2" },
                metadataRecord: { data: "Data 2" },
              },
            },
          ],
        },
      },
    ];
    const mapping = "Metastore";
    const expected = [
      {
        title: "Title 1",
        values: {
          data: "Data 1",
        },
      },
      {
        title: "Title 2",
        values: {
          data: "Data 2",
        },
      },
    ];
    expect(await formatBasedOnMapping(results, mapping)).toEqual(expected);
  });

  test("should return formatted results for unknown mapping", async () => {
    const results = [
      [
        { title: "Title 1", data: "Data 1" },
        { title: "Title 2", data: "Data 2" },
      ],
    ];
    const mapping = "Unknown";
    const expected = [
      { title: "Result 1", values: { title: "Title 1", data: "Data 1" } },
      { title: "Result 2", values: { title: "Title 2", data: "Data 2" } },
    ];
    expect(await formatBasedOnMapping(results, mapping)).toEqual(expected);
  });
});
