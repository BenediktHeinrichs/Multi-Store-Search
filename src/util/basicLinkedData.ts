import factory from "rdf-ext";
import { Readable } from "stream";
import rdfParser from "rdf-parse";
import type { Dataset } from "rdf-js";
import type QuadExt from "rdf-ext/lib/Quad";

export async function parseRDFDefinition(
  definition: string,
  contentType = "text/turtle",
  baseIRI = "http://aims.org",
): Promise<Dataset> {
  const input = new Readable({
    read: () => {
      input.push(definition);
      input.push(null);
    },
  });
  const dataset = factory.dataset();
  await new Promise((resolve) => {
    rdfParser
      .parse(input, { contentType: contentType, baseIRI: baseIRI })
      .on("data", (quad: QuadExt) => dataset.add(quad))
      .on("error", (error: unknown) => console.error(error))
      .on("end", () => resolve(dataset));
  });
  return dataset as unknown as Dataset;
}
