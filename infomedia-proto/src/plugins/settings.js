const infomediaSettings = {
	title: "Infomedia | How do algorithms make the news?",
	helpPage: "help-infomedia",
	esIndex: "infomedia",
	esTextField: "text",
	esEntitiesField: "entities",
	esTitleField: "heading",
	esSourceField: "sourcename",
	esDateField: "publishdate",
	basemap: "/add-datascape/data/Infomedia basemap.csv",
	basemapNodeSizeRatio: 1,
	basemapLabels: [
		// {x:0, y:0, anchor:'center', label:"Origin (test label annotation)"}
		{x:256, y:1058, anchor:'left', label:"European politics"},
		{x:602, y:907, anchor:'left', label:"International conflict"},
		{x:892, y:408, anchor:'left', label:"American politics"},
		{x:963, y:179, anchor:'left', label:"Music industry"},
		{x:693, y:-801, anchor:'left', label:"Arts & entertainment"},
		{x:12, y:-1251, anchor:'center', label:"Tech"},
		{x:-907, y:-588, anchor:'right', label:"Danish business"},
		{x:-851, y:537, anchor:'right', label:"Research & education"},
		{x:-473, y:1036, anchor:'right', label:"Danish politics"},
		{x:-321, y:1170, anchor:'center', label:"The Chinese dilemma"},
		{x:-217, y:38, anchor:'center', label:"Soccer"},
		{x:-217, y:38, anchor:'center', label:"Soccer"},
		{x:-15, y:211, anchor:'center', label:"Climate & development"},
	],
	basemapLabelsLines: [
		[ // The Chinese dilemma
			[-121,846],[-321,1130]
		],
	],
	basemapPolygons: [
		[ // European politics
			[155,599],[238,570],[335,614],[396,729],[429,884],[407,1003],[310,1090],[119,1122],[-15,1104],[-119,1032],[-130,967],[-58,931],[28,877],[72,819],[122,718],[137,635],[155,599]
		],[ // The Chinese dilemma
			[-62,870],[31,815],[78,725],[94,604],[55,511],[-39,491],[-70,608],[-78,718],[-133,796],[-121,846],[-62,870]
		],[ // Danish politics
			[-86,339],[-43,366],[-51,452],[-109,597],[-117,714],[-215,835],[-308,948],[-457,998],[-667,987],[-812,827],[-831,616],[-741,515],[-605,441],[-523,378],[-386,316],[-277,304],[-168,312],[-86,339]
		],[ // Research and education
			[-975,550],[-897,620],[-741,612],[-566,546],[-457,472],[-375,386],[-300,238],[-320,148],[-375,89],[-468,74],[-581,82],[-741,144],[-882,222],[-972,335],[-1011,472],[-975,550]
		],[ // Soccer
			[-148,109],[-121,78],[-125,-32],[-168,-71],[-242,-71],[-308,-55],[-339,-8],[-289,62],[-234,101],[-179,113],[-148,109]
		],[ // Climate & development
			[-113,82],[-129,117],[-129,253],[-59,308],[-59,308],[47,331],[121,265],[101,183],[101,183],[51,58],[-8,50],[-8,50],[-74,58],[-113,82]
		],[ // Danish business
			[-1280,206],[-1093,327],[-882,327],[-667,234],[-499,144],[-390,70],[-316,-51],[-254,-164],[-195,-316],[-222,-527],[-304,-656],[-652,-913],[-652,-913],[-933,-933],[-1143,-812],[-1342,-515],[-1412,-285],[-1389,0],[-1280,206]
		],[ // Tech
			[18,-403],[212,-391],[453,-502],[496,-625],[496,-625],[488,-779],[417,-1012],[50,-1225],[50,-1225],[-215,-1194],[-413,-1071],[-500,-933],[-464,-739],[-314,-565],[-160,-482],[18,-403]
		],[ // Music industry
			[694,-71],[690,-12],[777,150],[915,225],[915,225],[1069,229],[1164,51],[1164,51],[1133,-107],[1065,-166],[935,-174],[828,-162],[733,-119],[694,-71]
		],[ // Arts & entertainment
			[453,284],[552,229],[643,107],[643,107],[801,-162],[801,-162],[931,-285],[978,-439],[907,-625],[773,-743],[627,-814],[382,-715],[382,-715],[315,-593],[271,-383],[263,-158],[307,150],[307,150],[366,241],[453,284]
		],[ // American politics
			[635,715],[729,743],[880,719],[880,719],[963,652],[1022,533],[1034,427],[994,304],[915,253],[781,237],[623,312],[556,415],[567,632],[567,632],[635,715]
		],[ // International conflict
			[315,838],[413,877],[560,881],[686,861],[706,786],[646,581],[575,502],[575,502],[374,442],[374,442],[279,601],[279,601],[295,707],[291,759],[315,838]
		]
	],
}

const scopusSettings = {
	title: "Scopus",
	esIndex: "scopus",
	esTextField: "coredata.dc:description",
	esEntitiesField: "bmEntities",
	esTitleField: "coredata.dc:title",
	esSourceField: "coredata.prism:publicationName",
	esDateField: "coredata.prism:coverDate",
	basemap: "/add-datascape/data/Scopus basemap.csv",
	basemapNodeSizeRatio: 0.3,
	basemapLabels: [],
	basemapLabelsLines: [],
	basemapPolygons: [],
}

// export default scopusSettings
export default infomediaSettings
