<template>
	<div v-if="!dataLoaded || !data2Loaded" style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
		<div>
			Loading...
		</div>
	</div>
	<div v-else style="flex-grow: 1; display: flex;">
<!-- 		<div style="padding:6px;">
			{{ docs.length }} documents, {{ Object.keys(documentsByNE).length }} named entities
		</div> -->
		<div style="flex-grow: 1;" id="basemapContainer" onresize="updateBasemap()">
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  docs: Array,
  dataLoaded: Boolean
})

const documentsByNE = ref({})
const NEByDocument = ref({})
const data2Loaded = ref(false)

onMounted(() => {
	// Add event listener
	window.addEventListener('resize', updateBasemap);
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
    updateBasemap()
  })
})

onUnmounted(() => {
	// Add event listener
	window.removeEventListener('resize', updateBasemap);
})

watch(()=>props.docs, updateBasemap)

function updateBasemap() {
	console.log('Update basemap. Documents:', (props.docs || []).length)
}

</script>

