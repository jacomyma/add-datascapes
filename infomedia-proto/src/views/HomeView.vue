<script setup>
import { Base64 } from "js-base64";
import { onMounted, ref, reactive, watch } from "vue";
import QueryField from "../components/QueryField.vue";
import DocumentsPanel from "../components/DocumentsPanel.vue";
import BasemapPanel from "../components/BasemapPanel.vue";
import * as d3 from "d3";
import appSettings from "../plugins/settings";

// let docs = reactive({});
let docsFetched = ref([]);
let entitiesFetched = ref([]);
let docsTotal = ref(0);
let loaded = ref(false);
let query = ref("");
let docDisplayBatch = ref(25);
let docDisplayCount = ref(0);
let entitiesHighlight = ref(false);
let focusedEntities = ref([]);

const showEntitiesLabels = ref(true);
const showClusterShapes = ref(true);
const showClusterLabels = ref(true);
const quickButUgly = ref(false);
const docsPanel = ref(true);

const fetchES = function (route, params) {
  // const username = 'elastic'
  // const password = 'VAjkVhee**R1CeCiW+rj'
  // fetch("https://localhost:9200/", {
  const username = "elastic";
  const password = "9pSJ5siACNtVAUwB2mj8";
  return fetch("http://10.92.0.111:9200/" + route, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Basic " + Base64.encode(username + ":" + password),
    },
    body: JSON.stringify(params),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.warn(
        "/!\\ Server returned " + response.status + " : " + response.statusText
      );
    }
  });
};

const buildQueryObject = function () {
  if (query.value == "") {
    // Match all
    return {
      match_all: {},
    };
  } else {
    // Interpret the query field as a query_string
    return {
      query_string: {
        query: query.value,
        default_field: appSettings.esTextField,
      },
    };
  }
};

const initQuery = function () {
  console.log("Query:", buildQueryObject());
  docDisplayCount.value = 2 * docDisplayBatch.value;

  let body = {
    track_total_hits: true,
    from: 0,
    size: docDisplayCount.value,
    query: buildQueryObject(),
    aggs: {
      "entities-agg": {
        terms: {
          size: 10000,
          field: appSettings.esEntitiesField,
        },
      },
    },
  };
  if (query.value == "") {
    body["sort"] = {};
    body["sort"][appSettings.esDateField] = { order: "desc" };
  }

  fetchES(appSettings.esIndex + "/_search/", body)
    .then((response) => {
      console.log("Response:", response);
      docsFetched.value = response.hits.hits;
      if (
        response.aggregations &&
        response.aggregations["entities-agg"] &&
        response.aggregations["entities-agg"].buckets
      ) {
        entitiesFetched.value = response.aggregations["entities-agg"].buckets;
      }
      loaded.value = true;
      docsTotal.value = response.hits.total.value;
      highlightEntities.value({highlight:false, entities:[]});
    })
    .catch((err) => {
      console.warn(err);
    });
};

let loadBatch = ref(function () {
  // Load one more batch
  fetchES(appSettings.esIndex + "/_search/", {
    from: docDisplayCount.value,
    size: docDisplayBatch.value,
    query: buildQueryObject(),
  })
    .then((response) => {
      response.hits.hits.forEach((d) => {
        docsFetched.value.push(d);
      });
      docDisplayCount.value += docDisplayBatch.value;
    })
    .catch((err) => {
      console.warn(err);
    });
});

let highlightEntities = ref(function (obj) {
  if (obj.highlight) {
    focusedEntities.value = obj.entities.map((e) => {return {label:e, score:1}});
    entitiesHighlight.value = true
  } else {
    if (query.value == "") {
      focusedEntities.value = [];
      entitiesHighlight.value = false
    } else {
      focusedEntities.value = entitiesFetched.value.map((d) => {return {label:d.key, score:d.doc_count}});
      entitiesHighlight.value = true
    }
  }
});

onMounted(() => {
  initQuery();
});

watch(query, (newQuery) => {
  initQuery();
});
</script>

<style>
main {
  background-color: #9ba7a9;
}
.headline {
  padding: 12px;
}
.headline h1 {
  margin: 0;
}
.documents-panel {
  background-color: #cdd4d5;
}
</style>

<template>
  <main style="display: flex; flex-grow: 1; overflow: hidden">
    <div style="flex-grow: 1; display: flex; flex-direction: column">
      <div class="headline">
        <h1>ADD | {{ appSettings.title }}</h1>
      </div>
      <div
        style="
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        "
      >
        <queryField @query="(q) => (query = q)" :query="query"/>
      </div>
      <div style="padding: 6px; display:flex; flex-direction: row; justify-content: space-between;">
        <form class="pure-form">
          <fieldset>
            <label for="show-labels" style="padding: 6px">
              <input
                type="checkbox"
                id="show-labels"
                v-model="showEntitiesLabels"
              />
              Labels
            </label>
            <label for="show-cluster-shapes" style="padding: 6px">
              <input
                type="checkbox"
                id="show-cluster-shapes"
                v-model="showClusterShapes"
              />
              Cluster shapes
            </label>
            <label for="show-cluster-labels" style="padding: 6px">
              <input
                type="checkbox"
                id="show-cluster-labels"
                v-model="showClusterLabels"
              />
              Cluster labels
            </label>
            <label for="quick-but-ugly" style="padding: 6px">
              <input
                type="checkbox"
                id="quick-but-ugly"
                v-model="quickButUgly"
              />
              Ugly efficient
            </label>
          </fieldset>
        </form>
        <label for="docs-panel" style="padding: 6px; text-align: right">
          <!-- <input
            type="checkbox"
            id="docs-panel"
            v-model="docsPanel"
          />
          Docs Panel > -->
        </label>
      </div>
      <div style="background-color: #000; flex-grow: 1; display: flex">
        <basemapPanel
          :focused-entities="focusedEntities"
          :highlights="entitiesHighlight"
          :show-labels="showEntitiesLabels"
          :show-cluster-shapes="showClusterShapes"
          :show-cluster-labels="showClusterLabels"
          :quick-but-ugly="quickButUgly"
          @query="(q) => (query = q)"
          :query="query"
        />
      </div>
    </div>
    <div
      v-if="docsPanel"
      class="documents-panel"
      style="
        min-width: 600px;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
      "
    >
      <documentsPanel
        :docs="docsFetched"
        :data-loaded="loaded"
        :docs-total="docsTotal"
        @loadBatch="loadBatch"
        @focusedEntities="highlightEntities"
        :query="query"
      />
    </div>
  </main>
</template>
