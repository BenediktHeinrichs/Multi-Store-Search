<template>
  <div>
    <p class="fst-italic">
      Please provide a search term. This search term will be queried across
      multiple metadata stores.
    </p>
    <div>
      <b-form-group
        class="mb-3"
        label-class="fw-bold pt-0"
        label="Search Terms"
        label-for="term-input"
        description="Enter the search terms"
      >
        <b-input-group>
          <b-form-input
            id="term-input"
            v-model="terms"
            placeholder="Enter a search term"
          ></b-form-input>
        </b-input-group>
      </b-form-group>
      <div class="mb-3 d-grid gap-2">
        <button
          id="tokenButton"
          class="btn btn-secondary"
          type="button"
          @click="showTokens = !showTokens"
        >
          {{ showTokens ? "Hide" : "Show" }} Enter Tokens
        </button>
      </div>
      <b-collapse id="collapse-tokens" v-model="showTokens">
        <div v-for="mapping in mappings" :key="mapping">
          <b-form-group
            class="mb-3"
            label-class="fw-bold pt-0"
            :label="mapping + ' Token'"
            :label-for="mapping + '-input'"
            :description="'Enter the token for ' + mapping"
          >
            <b-input-group>
              <b-form-input
                :id="mapping + '-input'"
                v-model="tokens[mapping]"
                placeholder="Enter a token"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>
      </b-collapse>
      <div class="mb-3 d-grid gap-2">
        <button
          id="searchButton"
          class="btn btn-primary"
          type="button"
          :disabled="loading || !canSearch"
          @click="search"
        >
          Search
        </button>
      </div>
    </div>
    <div v-if="displayOutput.length" class="mb-3">
      <b-accordion>
        <b-accordion-item
          v-for="mappingOutput in displayOutput"
          :key="mappingOutput.mapping"
          :title="mappingOutput.mapping"
          visible
        >
          <div v-if="mappingOutput.results && mappingOutput.results.length">
            <b-accordion>
              <b-accordion-item
                v-for="(resultOutput, index) in mappingOutput.results"
                :key="index"
                :title="resultOutput.title"
              >
                <b-list-group>
                  <b-list-group-item
                    v-for="(value, key) in resultOutput.values"
                    :key="key"
                    class="d-flex justify-content-between align-items-start text-start"
                  >
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">{{ key }}</div>
                      {{ value }}
                    </div>
                  </b-list-group-item>
                </b-list-group>
              </b-accordion-item>
            </b-accordion>
          </div>
          <p v-else-if="mappingOutput.results" class="align-middle mb-0">
            No results for {{ mappingOutput.mapping }}.
          </p>
          <p v-else class="align-middle mb-0">
            Error for {{ mappingOutput.mapping }}.
          </p>
        </b-accordion-item>
      </b-accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import useEmitter from "@/plugins/emitter";
import {
  receiveMappings,
  searchMetadata,
  searchSchema,
} from "@/requests/rest-client";
import type { FormattedResults } from "@/types/formattedResults";
import { formatBasedOnMapping, formatResults } from "@/util/formatters";
import type { RemovableRef } from "@vueuse/core";

const mappings: Ref<string[]> = ref([]);
const tokens: Ref<Record<string, RemovableRef<string> | string>> = ref({});

const emitter = useEmitter();

const loading = ref(false);

onBeforeMount(async () => {
  loading.value = true;
  emitter.emit("asyncComponentLoading");
  mappings.value = await receiveMappings();
  for (const mapping of mappings.value) {
    tokens.value[mapping] = useLocalStorage("token." + mapping, "");
  }
  emitter.emit("asyncComponentLoaded");
  loading.value = false;
});

const terms = ref("");

const canSearch = computed(() => {
  return terms.value.length > 0;
});

const showTokens = ref(false);

const firstOption = { text: "Metadata", value: "Metadata" };

const schemaOrMetadata = ref(firstOption.value);

const output = ref("");
const displayOutput: Ref<
  {
    mapping: string;
    results?: FormattedResults[];
  }[]
> = ref([]);

const search = async () => {
  loading.value = true;
  emitter.emit("asyncComponentLoading");

  output.value = "";
  displayOutput.value = [];

  for (const mapping of mappings.value) {
    try {
      const clientId = `${mapping.toLowerCase()}_${schemaOrMetadata.value}_ID`;
      let token = tokens.value[mapping];
      if (typeof token !== "string") {
        token = token.value;
      }
      let searchFunction = searchMetadata;
      if (schemaOrMetadata.value === "Schema") {
        searchFunction = searchSchema;
      }
      const result = formatResults(
        await searchFunction({
          clientId,
          id: terms.value,
          token: token,
        }),
      );
      displayOutput.value.push({
        mapping: mapping,
        results: await formatBasedOnMapping(result, mapping),
      });
      output.value +=
        `Results from ${mapping}:\n` + JSON.stringify(result, null, 2) + "\n\n";
    } catch {
      displayOutput.value.push({
        mapping: mapping,
        results: undefined,
      });
      output.value += `An error occurred while running this request for ${mapping}!\n\n`;
    }
  }
  emitter.emit("asyncComponentLoaded");
  loading.value = false;
};
</script>

<style scoped>
.resultOutput {
  text-align: left;
}
</style>
