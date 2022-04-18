const infomediaSettings = {
	title: "Infomedia",
	esIndex: "infomedia",
	esTextField: "text",
	esEntitiesField: "entities",
	esTitleField: "heading",
	esSourceField: "sourcename",
	esDateField: "publishdate",
	basemap: "/add-datascape/data/Infomedia basemap.csv",
	sizeRatio: 1,
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
	sizeRatio: 0.3,
}


export default scopusSettings
// export default infomediaSettings
