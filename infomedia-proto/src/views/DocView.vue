<script setup>
import BasemapPanel from "../components/BasemapPanel.vue";
import appSettings from "../plugins/settings";
import { onMounted, ref, reactive, watch } from "vue";
import { Base64 } from "js-base64";
import { useRoute } from "vue-router";

const route = useRoute();
const showEntitiesLabels = ref(true);
const showClusterShapes = ref(true);
const showClusterLabels = ref(true);
const loaded = ref(false);
const doc = ref({});
const focusedEntities = ref([]);
const quickButUgly = ref(false);

// Note: this is for templating, so that we write JSON paths as strings in the settings
const get = ref((t, path) => path.split(".").reduce((r, k) => r?.[k], t));

const fetchES = function (route) {
  const username = "elastic";
  const password = "9pSJ5siACNtVAUwB2mj8";
  return fetch("http://10.92.0.111:9200/" + route, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Basic " + Base64.encode(username + ":" + password),
    },
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

let emitDoc = ref(function (doc) {
  if (
    doc &&
    doc._source &&
    get.value(doc._source, appSettings.esEntitiesField)
  ) {
    focusedEntities.value = get.value(doc._source, appSettings.esEntitiesField).map((e) => {return {label:e, score:1}});
  } else {
    focusedEntities.value = [];
  }
});

let emitEntity = ref(function (entity) {
  focusedEntities.value = [{label:entity, score:1}];
});

onMounted(() => {
  // We replace the middle dot by a normal dot
  // (because the normal dot was creating an issue somehow)
  let docId = route.params.id.replace(/·/gi,'.')
  fetchES(appSettings.esIndex + "/_doc/" + docId)
    .then((response) => {
      console.log(response);
      doc.value = response;
      focusedEntities.value = (get.value(
        doc.value._source,
        appSettings.esEntitiesField
      ) || []).map((e) => {return {label:e, score:1}});
      loaded.value = true;
    })
    .catch((err) => {
      console.warn(err);
    });
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
  background-color: #9ba7a9;
}
</style>

<template>
  <main style="display: flex; flex-grow: 1; overflow: hidden">
    <div style="flex-grow: 1; display: flex; flex-direction: column">
      <div class="headline">
        <h1>
          ADD | DOC
          <span v-if="loaded"
            >| {{ get(doc._source, appSettings.esTitleField) }}</span
          >
        </h1>
      </div>
      <div style="padding: 6px">
        <form class="pure-form">
          <fieldset>
            <label for="show-labels" style="padding: 6px">
              <input
                type="checkbox"
                id="show-labels"
                v-model="showEntitiesLabels"
              />
              Show labels
            </label>
            <label for="show-cluster-shapes" style="padding: 6px">
              <input
                type="checkbox"
                id="show-cluster-shapes"
                v-model="showClusterShapes"
              />
              Show cluster shapes
            </label>
            <label for="show-cluster-labels" style="padding: 6px">
              <input
                type="checkbox"
                id="show-cluster-labels"
                v-model="showClusterLabels"
              />
              Show cluster labels
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
      </div>
      <div
        style="background-color: #000; flex-grow: 1; display: flex"
        v-if="loaded"
      >
        <basemapPanel
          :highlights="true"
          :focused-entities="focusedEntities"
          :show-labels="showEntitiesLabels"
          :show-cluster-shapes="showClusterShapes"
          :show-cluster-labels="showClusterLabels"
          :quick-but-ugly="quickButUgly"
        />
      </div>
    </div>
    <div
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
      <div style="flex-grow: 1; overflow-y: auto">
        <div class="card" style="cursor: default" v-if="loaded">
          <h2>{{ get(doc._source, appSettings.esTitleField) }}</h2>
          <div class="card-content" style="white-space: pre-wrap">
            {{ get(doc._source, appSettings.esTextField) }}
          </div>
          <div class="pill-box">
            <div
              class="entity-pill"
              v-for="entity in get(doc._source, appSettings.esEntitiesField)"
              @mouseenter="emitEntity(entity)"
              @mouseleave="emitDoc(doc)"
            >
              {{ entity }}
            </div>
          </div>
          <small
            ><em>{{ get(doc._source, appSettings.esSourceField) }}</em>
            &nbsp;·&nbsp;
            {{ get(doc._source, appSettings.esDateField) }} &nbsp;·&nbsp;
            {{ doc._id }}
          </small>
        </div>
      </div>
    </div>
  </main>
</template>
