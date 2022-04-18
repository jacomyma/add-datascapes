<script setup>
import { ref } from "vue";
import appSettings from '../plugins/settings';

const props = defineProps({
  docsTotal: Number,
  docs: Array,
  dataLoaded: Boolean,
  loadBatch: Function,
});

const emit = defineEmits(['focusedEntities'])

const showText = ref(false);
const showEntities = ref(false);

let emitDoc = ref(function(doc) {
  if (doc && doc._source && doc._source.entities) {
    emit('focusedEntities', doc._source.entities)
  } else {
    emit('focusedEntities', [])
  }
})

let emitEntity = ref(function(entity) {
  emit('focusedEntities', [entity])
})

// Note: this is for templating, so that we write JSON paths as strings in the settings
const get = ref((t, path) => path.split(".").reduce((r, k) => r?.[k], t))

</script>

<style>
.card:hover {
  cursor: pointer;
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
  background-color: rgba(255,255,255,0.1);
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
            <input type="checkbox" id="show-text" v-model="showText" /> Show text
          </label>
          <label for="show-entities">
            <input type="checkbox" id="show-entities" v-model="showEntities" /> Show named entities
          </label>
        </fieldset>
      </form>
    </div>
    <div style="padding: 6px">{{ Number(docsTotal).toLocaleString() }} documents</div>
    <div style="flex-grow: 1; overflow-y: auto">
      <div
        v-for="doc in docs"
        @mouseenter="emitDoc(doc)"
        @mouseleave="emitDoc()"
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
          >{{ entity }}</div>
        </div>
        <small
          ><em>{{ get(doc._source, appSettings.esSourceField) }}</em> &nbsp;·&nbsp; {{ get(doc._source, appSettings.esDateField) }} &nbsp;·&nbsp;
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
