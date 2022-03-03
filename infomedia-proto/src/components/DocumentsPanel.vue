<script setup>
import { ref } from 'vue'

const props = defineProps({
  docs: Array,
  dataLoaded: Boolean
})

const showText = ref(true)

let articleDisplayBatch = ref(25)
let articleDisplayCount = ref(50)

</script>

<template>
	<div v-if="!dataLoaded" style="text-align: center">
		Loading...
	</div>
	<div v-else style="flex-grow: 1; display: flex; flex-direction: column; overflow-y: hidden;">
		<div style="padding:6px;">
			<form class="pure-form">
		    <fieldset>
		        <label for="headline-only">
		            <input type="checkbox" id="headline-only" v-model="showText"/> Show text
		        </label>
		    </fieldset>
		</form>
		</div>
		<div style="padding:6px;">
			{{ docs.length }} documents
		</div>
		<div style="flex-grow: 1; overflow-y: auto">
			<div
				v-for="doc in docs.filter((d,i) => i<articleDisplayCount)"
				class="card"
			>
				<h2>{{ doc.heading }}</h2>
				<div class="card-content" v-if="showText" style="white-space: pre-wrap;">
					{{doc.text}}
				</div>
				<small><em>{{doc.source}}</em>
          &nbsp;·&nbsp; {{doc.date}}
          &nbsp;·&nbsp; {{doc.id}}
        </small>
			</div>
			<div v-if="articleDisplayCount<docs.length" style="padding:6px; text-align: center;">
				<button class="pure-button" style="font-size: 85%;" @click="articleDisplayCount+=articleDisplayBatch">Load more...</button>
			</div>
		</div>
	</div>
</template>