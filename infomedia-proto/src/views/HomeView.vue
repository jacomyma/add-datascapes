<script setup>
import Fuse from 'fuse.js'
import { onMounted, ref, reactive, watch } from 'vue'
import QueryField from '../components/QueryField.vue'
import DocumentsPanel from '../components/DocumentsPanel.vue'
import * as d3 from 'd3'

let fuse
let docs = reactive({})
let docsFiltered = ref([])
let loaded = ref(false)
let query = ref("")


onMounted(() => {
  // Load Infomedia CSV
  console.log("Logging data...")
  d3.csv('/data/infomedia_raw.csv', row => {
    let obj = {}
    obj.id = row.duid
    obj.text = row.full_text
    obj.heading = row.heading
    obj.date = row.publishdate
    obj.source = row.sourcename
    obj.year = +row.year
    docs[obj.id] = obj
  })
  .then(() => {
    console.log("...done.")
    loaded.value = true
    docsFiltered.value = Object.values(docs)
    fuse = new Fuse(Object.values(docs), {
      keys: ['heading', 'text']
    })
  })
})

watch(query, (newQuery) => {
  if (newQuery && newQuery.length > 0) {
    let results = fuse.search(query.value)
    docsFiltered.value = results.map(r => {
      return r.item
    })
  } else {
    docsFiltered.value = Object.values(docs)
  }
})


</script>

<template>
  <main style="display: flex; flex-grow:1; overflow: hidden;">
    <div style="flex-grow:1; display: flex; flex-direction: column;">
      <div style="
        background-color: #444;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <queryField
          @query="(q) => query = q"
        />
      </div>
      <div style="
        background-color: #333;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <div>
          Basemap - Query: {{query || "None."}}
        </div>
      </div>
    </div>
    <div style="
      width: 600px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
    ">
      <documentsPanel
        :docs="docsFiltered"
        :data-loaded="loaded"
      />
    </div>
  </main>
</template>
