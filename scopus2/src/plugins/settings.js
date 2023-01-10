let scopus2Settings = {
  title: "Scopus v2",
  helpPage: "help-scopus",
  esURL: "https://add.learning.aau.dk/elasticsearch/", // The URL to connect to ElasticSearch
  esUsername: "elastic",              // The username to connect to the index
  esPassword: "9pSJ5siACNtVAUwB2mj8", // The password to connect to the index
  esIndex: "scopus",
  esTextField: "coredata.dc:description",
  esEntitiesField: "bm2Entities",
  esTitleField: "coredata.dc:title",
  esSourceField: "coredata.prism:publicationName",
  esDateField: "coredata.prism:coverDate",
  basemap: "data/scopus2basemap.csv",
  heatmapSpread: 0.5,
  basemapNodeSizeRatio: 0.1,
  basemapLabels: [
    {x: 2983.1838, y: 552.1252, anchor:"center", label:"SOCIAL SCIENCE"},
    {x: 469.4146, y: 938.8289, anchor:"center", label:"COMPUTER SCIENCE"},
    {x: 6339.895, y: 1562.0897, anchor:"center", label:"HEALTH & MEDICAL SCIENCE"},
    {x: 6058.6323, y: 4336.833, anchor:"right", label:"GENETICS"},
    {x: 3848.0242, y: 6534.0225, anchor:"right", label:"MATERIALS"},
    {x: 3480.3528, y: 4867.1558, anchor:"center", label:"FLIGHT"},
    {x: 2577.4038, y: 6091.125, anchor:"right", label:"FLUIDS"},
    {x: 1544.4121, y: 5563.4009, anchor:"center", label:"ELECTRICITY"},
    {x: 347.6853, y: 4530.9292, anchor:"center", label:"SIGNAL PROCESSING"},
    {x: 441.0605, y: 2761.4417, anchor:"right", label:"CRYPTOGRAPHY"},
    {x: 2555.2563, y: 2369.2124, anchor:"left", label:"ECONOMICS"},
    {x: 5517.6328, y: 6000.1123, anchor:"left", label:"CHEMISTRY"},
    {x: 5273.9116, y: 7507.5063, anchor:"left", label:"REMOTE SENSING"},
  ],
  basemapLabelsLines: [
    [[6058.6, 4336.8], [6342.5, 4620.7]],
    [[5541.3, 5881.2], [5283.3, 5623.3]],
    [[3658.3, 6386.4], [3658.3, 5926.2]],
    [[3473.4, 5286.3], [3473.4, 4908.6]],
    [[2873.7, 5459.4], [2377.4, 5955.7]],
    [[6216.3, 1635.2], [6216.3, 1833.9]],
    [[417, 1018.6], [417, 1238.3]],
  ],
  basemapPolygons: [
    [
      [-159.4,3109.8],
      [-201.1,2581.6],
      [-131.5,2004.6],
      [209.3,1378.8],
      [681.8,1073.1],
      [1188.7,1018.6],
    ],
    [
      [2089.8,1128.5],
      [2305.4,836.4],
      [2667,669.6],
      [3126.3,669.6],
      [3549.8,766.1],
      [3772.2,967.9],
      [3918.8,1267.5 ],
    ],
    [
      [5371.5,1764.8],
      [6011,1771.3],
      [6601.9,1961.7],
      [7116.5,2327.8],
      [7373.7,2814.6],
      [7561.6,3397.9],
      [7624.1,3961.7],
      [7575.5,4768.3],
      [7318.1,5153.8],
      [6866.4,5463.5 ],
    ],
    [
      [607.2,2334.8],
      [512.8,2510.9],
      [492.6,2710.2],
      [545.5,2879.7],
      [680.1,2994.9],
      [802.1,3016.5],
    ],
    [
      [89.2,3367.2],
      [-91.6,3516.7],
      [-201.1,3819.3],
      [-136.8,4127.9],
      [110.3,4361.4],
      [370.8,4382.6],
      [692,4347.4],
      [906.3,4212],
      [1042.1,4080.4],
    ],
    [
      [1924.7,2258.3],
      [2004.6,2359.2],
      [2192.4,2426],
      [2355.9,2397.4],
      [2518.5,2276.2],
      [2578.2,2129.7],
    ],
    [
      [1319.9,4854.6],
      [1325.8,5053.2],
      [1445,5275.7],
      [1665.5,5394.1],
      [1945.5,5421.9],
      [2164.1,5376.6],
      [2283.4,5279.2 ],
    ],
    [
      [2780.6,5213],
      [2797.2,5355.9],
      [2873.7,5459.4],
      [2996.9,5526.1],
      [3100,5522.8],
    ],
    [
      [3298.2,5265.6],
      [3473.4,5286.3],
      [3649,5380.3],
      [3767.3,5463.5],
      [3860.9,5596],
      [3896.4,5731.2],
    ],
    [
      [3489.2,5962.5],
      [3674.6,5926.2],
      [3855.8,5845.1],
      [4073.1,5671.3],
      [4191.4,5484.3],
      [4247.6,5227.1],
      [4236.2,5028.9],
      [4194.5,4935.1 ],
    ],
    [
      [4128.6,6200.7],
      [4258.3,6266.4],
      [4565.9,6220.6],
      [4754.3,6131.3],
      [4913.4,5990.6],
      [5064.8,5780.1],
      [5336.1,5589.5],
      [5579.2,5526.9],
      [5926.9,5475.1],
      [6209.2,5427.8],
      [6511,5308],
      [6679.1,5130.5],
      [6724.8,5015.9 ],
    ],
    [
      [4128.6,7112.2],
      [4222.7,7377.9],
      [4488.4,7581.4],
      [4837.7,7607.5],
      [5093.4,7539.7],
      [5388.3,7294.6],
      [5447.2,7143.4 ],
    ],
    [
      [6026.4,5104.6],
      [6172.2,4833.8],
      [6474.7,4457.9],
      [6778.9,4208.1],
      [7016.7,4093.9],
      [7111.5,4070.3],
    ],
  ],
};

// Update settings coordinates because they come from a SVG that is not exactly aligned with node coordinates
const sizeFactor = 1.15
const xOffset = -4500
const yOffset = 4200
const pointTransformer = point => {
  point[0] = xOffset + sizeFactor*point[0]
  point[1] = yOffset - sizeFactor*point[1]
}
const xyTransformer = d => {
  d.x = xOffset + sizeFactor*d.x
  d.y = yOffset - sizeFactor*d.y
}
scopus2Settings.basemapPolygons.forEach(polygon => {
  polygon.forEach(pointTransformer)
})
scopus2Settings.basemapLabelsLines.forEach(line => {
  line.forEach(pointTransformer)
})
scopus2Settings.basemapLabels.forEach(xyTransformer)


export default scopus2Settings;



/*export default {
  title: "Poney (change this title)", // The name displayed on top of the datascape
  helpPage: "help",                   // The route to the help page
  basemap: "data/Sample basemap.csv", // Edit to match the namr of your basemap file

  // ElasticSearch configuration
  esURL: "xxxxxx",                    // The URL to connect to ElasticSearch
  esUsername: "xxxxxx",               // The username to connect to the index
  esPassword: "XXXXXX",               // The password to connect to the index
  esIndex: "infomedia",               // The name of the ElasticSearch index where the documents are stored
  esTextField: "text",                // Field name for the document text
  esEntitiesField: "entities",        // Field name for the words, expressions or named entities
  esTitleField: "heading",            // Field name for the document title
  esSourceField: "sourcename",        // Field name for the source title (ex: journal)
  esDateField: "publishdate",         // Field name for the document date

  // Graphical settings
  heatmapSpread: 2,         // Higher means larger hill shades
  basemapNodeSizeRatio: 1,  // Higher means bigger nodes
  basemapLabels: [          // Add labels to the basemap (same coordinates as the nodes)
    { x: -473, y: 1036, anchor: "right", label: "Danish politics" },
    { x: -321, y: 1170, anchor: "center", label: "The Chinese dilemma" },
  ],
  basemapLabelsLines: [     // Add lines to the basemap (same coordinates as the nodes)
    [
      // The Chinese dilemma
      [-121, 846],
      [-321, 1130],
    ],
  ],
  basemapPolygons: [        // Add polygons to the basemap (same coordinates as the nodes)
    [
      // The Chinese dilemma
      [-62, 870],
      [31, 815],
      [78, 725],
      [94, 604],
      [55, 511],
      [-39, 491],
      [-70, 608],
      [-78, 718],
      [-133, 796],
      [-121, 846],
      [-62, 870],
    ],
    [
      // Danish politics
      [-86, 339],
      [-43, 366],
      [-51, 452],
      [-109, 597],
      [-117, 714],
      [-215, 835],
      [-308, 948],
      [-457, 998],
      [-667, 987],
      [-812, 827],
      [-831, 616],
      [-741, 515],
      [-605, 441],
      [-523, 378],
      [-386, 316],
      [-277, 304],
      [-168, 312],
      [-86, 339],
    ],
  ],
};*/