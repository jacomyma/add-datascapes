<script setup>
import { ref } from "vue";

const emit = defineEmits(["query"]);

const query = ref("");

function validate() {
  emit("query", query.value);
}
</script>

<template>
  <div class="pure-form">
    <input
      type="text"
      v-model="query"
      @keyup.enter="validate"
      class="pure-input-rounded"
      style="margin-right: 12px"
    />
    <button class="pure-button" @click="validate">Filter</button>
  </div>
</template>
