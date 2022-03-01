import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as d3 from 'd3'

const app = createApp(App);

app.use(router);

app.mount("#app");

// Load Infomedia CSV
console.log("Logging data...")
var data = {}
d3.csv('/data/infomedia_raw.csv', row => {
	var obj = {}
	obj.id = row.duid
	obj.text = row.full_text
	obj.heading =	row.heading
	/*
	obj.links = []
	try {
		obj.links = JSON.parse(row.links)
	} catch(e) {
		console.warn(e)
	}
	*/
	obj.date = row.publishdate
	obj.source = row.sourcename
	obj.year = +row.year
	data[obj.id] = obj
})
console.log("...done.")
