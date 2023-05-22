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
      <b-form-group
        class="mb-3"
        label-class="fw-bold pt-0"
        label="Schema Or Metadata"
        label-for="schema-or-metadata-input"
        description="Select if you want to search for schemas or metadata"
      >
        <b-input-group>
          <b-form-select
            id="schema-or-metadata-input"
            v-model="schemaOrMetadata"
            :options="schemaOrMetadataOptions"
          ></b-form-select>
        </b-input-group>
      </b-form-group>
      <div class="mb-3 d-grid gap-2">
        <button
          id="searchButton"
          class="btn btn-secondary"
          type="button"
          :disabled="loading || !canSearch"
          @click="search"
        >
          Search
        </button>
      </div>
    </div>
    <pre v-if="output !== ''">
      {{ output }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import useEmitter from "@/plugins/emitter";
import {
  receiveMappings,
  searchMetadata,
  searchSchema,
} from "@/requests/rest-client";

const emitter = useEmitter();

const loading = ref(false);
const terms = ref("");

const canSearch = computed(() => {
  return terms.value.length > 0;
});

const firstOption = { text: "Schema", value: "Schema" };

const schemaOrMetadataOptions = ref([
  firstOption,
  { text: "Metadata", value: "Metadata" },
]);

const schemaOrMetadata = ref(firstOption.value);

const output = ref("");

const search = async () => {
  loading.value = true;
  emitter.emit("asyncComponentLoading");

  const mappings = await receiveMappings();
  output.value = "";

  try {
    for (const mapping of mappings) {
      const clientId = `${mapping.toLowerCase()}_${schemaOrMetadata.value}_ID`;
      if (schemaOrMetadata.value === "Schema") {
        output.value += await searchSchema({
          clientId,
          id: terms.value,
          token: "",
        });
      } else {
        output.value += await searchMetadata({
          clientId,
          id: terms.value,
          token: "",
        });
      }
    }
  } catch {
    output.value = "An error occurred while running this request!";
  } finally {
    emitter.emit("asyncComponentLoaded");
    loading.value = false;
  }
};
</script>
