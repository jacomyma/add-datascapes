<script setup>
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  docs: Array,
  dataLoaded: Boolean
})

const documentsByNE = ref({})
const NEByDocument = ref({})
const data2Loaded = ref(false)

onMounted(() => {
  // Load Infomedia CSV
  console.log("Loading named entities data...")
  let _documentsByNE = {}
  let _NEByDocument = {}
  d3.csv('/data/infomedia_docid_NER.csv', row => {
    const doc = row.duid
    const NEList = row[0].split('|')
    _NEByDocument[doc] = NEList
    NEList.forEach(ne => {
    	if (_documentsByNE[ne] === undefined) {
	    	_documentsByNE[ne] = []
	    }
	    _documentsByNE[ne].push(doc)
    })
  })
  .then(() => {
    console.log("...named entities data loaded.")
    documentsByNE.value = _documentsByNE
    NEByDocument.value = _NEByDocument
    data2Loaded.value = true
  })
})
</script>

<template>
	<div v-if="!dataLoaded || !data2Loaded" style="text-align: center">
		Loading...
	</div>
	<div v-else style="flex-grow: 1; display: flex; flex-direction: column; overflow-y: hidden;">
		<div style="padding:6px;">
			{{ docs.length }} documents, {{ Object.keys(documentsByNE).length }} named entities
		</div>
	</div>
</template>