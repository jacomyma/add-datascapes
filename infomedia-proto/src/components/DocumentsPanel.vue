<script setup>
import { ref } from "vue";

const props = defineProps({
  docsTotal: Number,
  docs: Array,
  dataLoaded: Boolean,
  loadBatch: Function,
});

const emit = defineEmits(['focusedEntities'])

const showText = ref(false);
const showEntities = ref(true);

let emitDoc = ref(function(doc) {
  if (doc && doc._source && doc._source.entities) {
    emit('focusedEntities', doc._source.entities)
  } else {
    emit('focusedEntities', [])
  }
  console.log("hh")
})

let emitEntity = ref(function(entity) {
  // console.log("Emit entity", entity)
  emit('focusedEntities', [entity])
})

</script>

<style>
.card:hover {
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
        <h2>{{ doc._source.heading }}</h2>
        <div class="card-content" v-if="showText" style="white-space: pre-wrap">
          {{ doc._source.full_text }}
        </div>
        <div class="card-content" v-if="showEntities" style="white-space: pre-wrap">
          <strong v-if="showText">Named entities: </strong>
          <span
            v-for="entity in doc._source.entities"
            @mouseenter="emitEntity(entity)"
            @mouseleave="emitDoc(doc)"
          >{{ entity }}</span>
        </div>
        <small
          ><em>{{ doc._source.sourcename }}</em> &nbsp;·&nbsp; {{ doc._source.publishdate }} &nbsp;·&nbsp;
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
