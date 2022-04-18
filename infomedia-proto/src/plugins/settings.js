const infomediaSettings = {
	title: "Infomedia",
	esIndex: "infomedia",
	esTextField: "text",
	esEntitiesField: "entities",
	esTitleField: "heading",
	esSourceField: "sourcename",
	esDateField: "publishdate",
	basemap: "/add-datascape/data/Infomedia basemap.csv",
	basemapNodeSizeRatio: 1,
	basemapLabels: [
		{x:0, y:0, anchor:'center', label:"Origin (test label annotation)"}
	],
	basemapPolygons: [
		[
			[-62,971],
			[-70,798],
			[-27,582],
			[216,531],
			[266,678],
			[281,956],
			[154,1145],
			[-62,971]
		]
	],
}

const scopusSettings = {
	title: "Scopus",
	esIndex: "scopus",
	esTextField: "coredata.dc:description",
	esEntitiesField: "entities",
	esTitleField: "coredata.dc:title",
	esSourceField: "coredata.prism:publicationName",
	esDateField: "coredata.prism:coverDate",
	basemap: "/add-datascape/data/Scopus basemap.csv",
	basemapNodeSizeRatio: 0.3,
	basemapLabels: [],
	basemapPolygons: [],
}


// export default scopusSettings
export default infomediaSettings
