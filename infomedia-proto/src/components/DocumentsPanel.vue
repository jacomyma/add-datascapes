<script setup>

const props = defineProps({
  docs: Array,
  dataLoaded: Boolean
})

</script>

<template>
	<div v-if="!dataLoaded" style="text-align: center">
		Loading...
	</div>
	<div v-else style="flex-grow: 1; display: flex;">
		Here be a list of {{ docs.length }} documents
	</div>
</template>