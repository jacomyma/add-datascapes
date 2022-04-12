<script setup>
import { ref } from "vue";

const props = defineProps({
  docsTotal: Number,
  docs: Array,
  dataLoaded: Boolean,
  loadBatch: Function,
});

const showText = ref(false);

</script>

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
          <label for="headline-only">
            <input type="checkbox" id="headline-only" v-model="showText" /> Show
            text
          </label>
        </fieldset>
      </form>
    </div>
    <div style="padding: 6px">{{ Number(docsTotal).toLocaleString() }} documents</div>
    <div style="flex-grow: 1; overflow-y: auto">
      <div
        v-for="doc in docs"
        class="card"
      >
        <h2>{{ doc._source.heading }}</h2>
        <div class="card-content" v-if="showText" style="white-space: pre-wrap">
          {{ doc._source.full_text }}
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
