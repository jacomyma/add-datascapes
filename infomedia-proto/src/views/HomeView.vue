<script setup>
import { onMounted, ref, reactive } from 'vue'
import QueryField from '../components/QueryField.vue'
import DocumentsPanel from '../components/DocumentsPanel.vue'
import * as d3 from 'd3'

let docs = reactive({})
let loaded = ref(false)


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
  })
})

</script>

<template>
  <main style="display: flex; flex-grow:1;">
    <div style="flex-grow:1; display: flex; flex-direction: column;">
      <div style="
        background-color: #444;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <queryField/>
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
          Basemap
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
        :docs="Object.values(docs)"
        :data-loaded="loaded"
      />
    </div>
  </main>
</template>
