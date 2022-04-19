<script setup>
import { Base64 } from 'js-base64';
import { onMounted, ref, reactive, watch } from "vue";
import QueryField from "../components/QueryField.vue";
import DocumentsPanel from "../components/DocumentsPanel.vue";
import BasemapPanel from "../components/BasemapPanel.vue";
import * as d3 from "d3";
import appSettings from '../plugins/settings';

// let docs = reactive({});
let docsFetched = ref([]);
let entitiesFetched = ref([]);
let docsTotal = ref(0);
let loaded = ref(false);
let query = ref("");
let docDisplayBatch = ref(25);
let docDisplayCount = ref(0)
let focusedEntities = ref([])

const showEntitiesLabels = ref(true);
const showClusterShapes = ref(true);
const showClusterLabels = ref(true);

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
          "default_field": appSettings.esTextField
        }
      }
  }
}

const initQuery = function() {
  console.log("Query:", buildQueryObject())
  docDisplayCount.value = 2*docDisplayBatch.value
  
  let body = {
    "track_total_hits": true,
    "from": 0,
    "size": docDisplayCount.value,
    "query": buildQueryObject(),
    "aggs": {
      "entities-agg": {
        "terms": {
          "size": 100,
          "field": appSettings.esEntitiesField
        }
      }
    }
  }
  if (query.value == "") {
    body["sort"] = {
      "publishdate": {
        "order": "desc"
      }
    }
  }

  fetchES(appSettings.esIndex+"/_search/", body)
  .then(response => {
    console.log(response)
    docsFetched.value = response.hits.hits
    if (response.aggregations && response.aggregations['entities-agg'] && response.aggregations['entities-agg'].buckets) {
      entitiesFetched.value = response.aggregations['entities-agg'].buckets
    }
    loaded.value = true
    docsTotal.value = response.hits.total.value
    highlightEntities.value()
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

let highlightEntities = ref(function(hoveredEntities) {
  if (hoveredEntities && hoveredEntities.length > 0) {
    focusedEntities.value = hoveredEntities
  } else {
    if (query.value == "") {
      focusedEntities.value = []
    } else {
      focusedEntities.value = entitiesFetched.value.map(d => d.key)
      
    }
  }
})

onMounted(() => {
  initQuery()
});

watch(query, (newQuery) => {
  initQuery()
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
      <div class="headline"><h1>ADD | {{ appSettings.title }}</h1></div>
      <div
        style="
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        "
      >
        <queryField @query="(q) => (query = q)" />
      </div>
      <div style="padding: 6px">
        <form class="pure-form">
          <fieldset>
            <label for="show-labels" style="padding: 6px">
              <input type="checkbox" id="show-labels" v-model="showEntitiesLabels" /> Show labels
            </label>
            <label for="show-cluster-shapes" style="padding: 6px">
              <input type="checkbox" id="show-cluster-shapes" v-model="showClusterShapes" /> Show cluster shapes
            </label>
            <label for="show-cluster-labels" style="padding: 6px">
              <input type="checkbox" id="show-cluster-labels" v-model="showClusterLabels" /> Show cluster labels
            </label>
          </fieldset>
        </form>
      </div>
      <div style="background-color: #000; flex-grow: 1; display: flex">
        <basemapPanel
          :focused-entities="focusedEntities"
          :show-labels="showEntitiesLabels"
          :show-cluster-shapes="showClusterShapes"
          :show-cluster-labels="showClusterLabels"
        />
      </div>
    </div>
    <div
      class="documents-panel"
      style="
        width: 600px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
      "
    >
      <documentsPanel :docs="docsFetched" :data-loaded="loaded" :docs-total="docsTotal" @loadBatch="loadBatch" @focusedEntities="highlightEntities"/>
    </div>
  </main>
</template>
