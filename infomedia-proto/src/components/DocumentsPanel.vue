<script setup>
import { ref } from "vue";
import appSettings from "../plugins/settings";
import router from "@/router";

const props = defineProps({
  docsTotal: Number,
  docs: Array,
  dataLoaded: Boolean,
  loadBatch: Function,
});

const emit = defineEmits(["focusedEntities"]);

const showText = ref(false);
const showEntities = ref(false);
const selectedDoc = ref(false);

// Note: this is for templating, so that we write JSON paths as strings in the settings
const get = ref((t, path) => path.split(".").reduce((r, k) => r?.[k], t));

let emitDoc = ref(function (doc) {
  if (
    doc &&
    doc._source
  ) {
    emit(
      "focusedEntities",
      {
        highlight:true,
        entities:(get.value(doc._source, appSettings.esEntitiesField) || [])
      }
    );
  } else {
    emit("focusedEntities", {highlight:false, entities:[]});
  }
});

let emitEntity = ref(function (entity) {
  emit("focusedEntities", {highlight:true, entities:[entity]});
});

let openDoc = ref(function (id) {
  // For some reason I don't get, the normal dot "." creates an issue.
  // So we just replace it with a middle dot "·".
  const resolved = router.resolve({
    name: "doc",
    params: { id: id.replace(/\./gi,'·') },
  });
  const targetUrl = resolved.href;
  console.log(targetUrl);
  window.open(targetUrl);
});
</script>

<style>
.card {
  cursor: pointer;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 6px 10px rgb(0 0 0 / 8%), 0 0 6px rgb(0 0 0 / 5%);
  transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
    0.3s box-shadow,
    0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);
  padding: 6px 12px;
  margin: 12px;
  font-family: "IBM Plex Serif", serif;
}
.card-content {
  font-size: 1.15em;
  line-height: 1.6em;
  margin-top: 12px;
  margin-bottom: 6px;
  word-wrap: break-word;
}
.pill-box {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  gap: 6px;
}
.entity-pill {
  border-radius: 12px;
  min-width: 24px;
  min-height: 24px;
  background-color: #eeeeee;
  padding: 1px 12px;
  font-family: sans-serif;
  cursor: pointer;
}
</style>

<template>
  <div v-if="!dataLoaded" style="text-align: center">Loading...</div>
  <div
    v-else
    style="
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow-y: hidden;
    "
  >
    <div style="padding: 6px">
      <form class="pure-form">
        <fieldset>
          <label for="show-text" style="padding: 6px">
            <input type="checkbox" id="show-text" v-model="showText" /> Show
            text
          </label>
          <label for="show-entities" style="padding: 6px">
            <input type="checkbox" id="show-entities" v-model="showEntities" />
            Show named entities
          </label>
        </fieldset>
      </form>
    </div>
    <div style="padding: 6px">
      {{ Number(docsTotal).toLocaleString() }} documents
    </div>
    <div style="flex-grow: 1; overflow-y: auto">
      <div
        v-for="doc in docs"
        @mouseenter="emitDoc(doc)"
        @mouseleave="emitDoc()"
        @click="openDoc(doc._id)"
        class="card"
      >
        <h2>{{ get(doc._source, appSettings.esTitleField) }}</h2>
        <div class="card-content" v-if="showText" style="white-space: pre-wrap">
          {{ get(doc._source, appSettings.esTextField) }}
        </div>
        <div v-if="showEntities" class="pill-box">
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
      <div
        v-if="docs.length < docsTotal"
        style="padding: 6px; text-align: center"
      >
        <button
          class="pure-button"
          style="font-size: 85%"
          @click="$emit('loadBatch')"
        >
          Load more...
        </button>
      </div>
    </div>
  </div>
</template>
