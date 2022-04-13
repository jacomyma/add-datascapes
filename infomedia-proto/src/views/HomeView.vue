<script setup>
import { Base64 } from 'js-base64';
import { onMounted, ref, reactive, watch } from "vue";
import QueryField from "../components/QueryField.vue";
import DocumentsPanel from "../components/DocumentsPanel.vue";
import BasemapPanel from "../components/BasemapPanel.vue";
import * as d3 from "d3";

// let docs = reactive({});
let docsFetched = ref([]);
let docsTotal = ref(0);
let loaded = ref(false);
let query = ref("");
let docDisplayBatch = ref(25);
let docDisplayCount = ref(0)
let focusedEntities = ref([])

const fetchES = function(route, params) {
  // const username = 'elastic'
  // const password = 'VAjkVhee**R1CeCiW+rj'
  // fetch("https://localhost:9200/", {
  const username = 'elastic'
  const password = '9pSJ5siACNtVAUwB2mj8'
  return fetch("http://10.92.0.111:9200/"+route, {
    "method": "POST",
    "headers": {
      "Content-type": "application/json; charset=UTF-8",
      'Authorization': 'Basic ' + Base64.encode(username + ":" + password),
    },
    "body": JSON.stringify(params)
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    } else {
      console.warn("/!\\ Server returned " + response.status + " : " + response.statusText);
    }
  })
}

const buildQueryObject = function() {
  if (query.value == "") {
    // Match all
    return {
        "match_all": {
        }
      }
  } else {
    // Interpret the query field as a query_string
    return {
        "query_string": {
          "query": query.value,
          "default_field": "full_text"
        }
      }
  }
}

const initQuery = function() {
  console.log("Query:", buildQueryObject())
  docDisplayCount.value = 2*docDisplayBatch.value
  fetchES("infomedia/_search/", {
      "track_total_hits": true,
      "from": 0,
      "size": docDisplayCount.value,
      "query": buildQueryObject()
    })
  .then(response => {
    console.log(response)
    docsFetched.value = response.hits.hits
    loaded.value = true
    docsTotal.value = response.hits.total.value
  })
  .catch(err => {
    console.warn(err);
  });
}

let loadBatch = ref(function() {
  // Load one more batch
  fetchES("infomedia/_search/", {
      "from": docDisplayCount.value,
      "size": docDisplayBatch.value,
      "query": buildQueryObject()
    })
  .then(response => {
    response.hits.hits.forEach(d => {
      docsFetched.value.push(d)
    })
    docDisplayCount.value += docDisplayBatch.value
  })
  .catch(err => {
    console.warn(err);
  });
})



onMounted(() => {
  initQuery()
});

watch(query, (newQuery) => {
  initQuery()
});
</script>

<template>
  <main style="display: flex; flex-grow: 1; overflow: hidden">
    <div style="flex-grow: 1; display: flex; flex-direction: column">
      <div
        style="
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        "
      >
        <queryField @query="(q) => (query = q)" />
      </div>
      <div style="background-color: #000; flex-grow: 1; display: flex">
        <basemapPanel :docs="docsFetched" :data-loaded="loaded" :focused-entities="focusedEntities"/>
      </div>
    </div>
    <div
      style="
        width: 600px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
      "
    >
      <documentsPanel :docs="docsFetched" :data-loaded="loaded" :docs-total="docsTotal" @loadBatch="loadBatch" @focusedEntities="(fe) => focusedEntities = fe"/>
    </div>
  </main>
</template>
