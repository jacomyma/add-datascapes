<script setup>
import { ref } from "vue";

const emit = defineEmits(["query"]);

const query = ref("");

function validate() {
  emit("query", query.value);
}
</script>

<template>
  <div class="pure-form" style="display: flex; padding: 12px;">
    <input
      type="text"
      v-model="query"
      @keyup.enter="validate"
      class="pure-input-rounded"
      style="margin-right: 12px; flex-grow: 1;"
    />
    <button class="pure-button" @click="validate" style="width: 200px">Filter</button>
  </div>
</template>
