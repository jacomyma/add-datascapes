<script setup>
import { ref, watch } from "vue";
import appSettings from "../plugins/settings";

const emit = defineEmits(["query"]);

const query = ref("");

const props = defineProps({
  query: String
})

watch(() => props.query, function(){ query.value = props.query });

function validate() {
  emit("query", query.value);
}
</script>

<template>
  <div class="pure-form" style="display: flex; padding: 12px">
    <input
      type="text"
      v-model="query"
      @keyup.enter="validate"
      class="pure-input-rounded"
      style="margin-right: 12px; flex-grow: 1"
    />
    <button
      class="pure-button pure-button-primary"
      @click="validate"
      style="width: 200px; margin-right: 12px"
    >
      Filter
    </button>
    <a class="pure-button" :href="appSettings.helpPage" target="_blank"
      >Help?</a
    >
  </div>
</template>
