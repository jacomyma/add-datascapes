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
    /*{x:629.0581,  y: 2340.0337, anchor: "left", label: "Parallelization"},
    {x:792.676,   y: 2586.7717, anchor: "left", label: "Very large scale integration"},
    {x:938.25,    y: 2989.3545, anchor: "left", label: "Cryptography &amp; steganography"},
    {x:910.6841,  y: 3069.5854, anchor: "left", label: "Blockchain"},
    {x:930.0471,  y: 3164.7129, anchor: "left", label: "Ensuring anonymity"},
    {x:1122.1382, y: 3182.2529, anchor: "left", label: "Watermarking"},
    {x:1413.5796, y: 3307.7358, anchor: "left", label: "Denoising algorithms"},
    {x:1015.1843, y: 3455.9954, anchor: "left", label: "Video coding"},
    {x:717.7009,  y: 3294.9219, anchor: "left", label: "Network-on-chip"},
    {x:1121.8962, y: 2977.7065, anchor: "left", label: "Protection against intrusion &amp; phishing"},
    {x:1485.1394, y: 2014.3079, anchor: "left", label: "Clustering techniques in machine learning"},
    {x:1508.1958, y: 1580.9946, anchor: "left", label: "Petri nets"},
    {x:1874.1389, y: 1639.9238, anchor: "left", label: "Graph algorithms"},
    {x:1567.9614, y: 885.2864,  anchor: "left", label: "Generative adversarial networks"},*/
  ],
  basemapLabelsLines: [],
  basemapPolygons: [
    [
      [-182.1,3553.6],
      [-229.8,2950],
      [-150.3,2290.6],
      [239.2,1575.5],
      [779.1,1226.2],
      [1358.3,1163.9],
    ],
    [
      [2388,1289.5],
      [2634.4,955.8],
      [3047.6,765.1],
      [3572.4,765.1],
      [4056.4,875.4],
      [4310.5,1106],
      [4478,1448.4],
    ],
    [
      [6138,2016.6],
      [6868.8,2024.1],
      [7544,2241.6],
      [8132,2660],
      [8425.9,3216.2],
      [8640.6,3882.8],
      [8712.1,4527],
      [8656.5,5448.7],
      [8362.4,5889.3],
      [7846.2,6243.1],
    ],
    [
      [693.8,2668],
      [586,2869.2],
      [562.9,3097],
      [623.4,3290.6],
      [777.1,3422.3],
      [916.6,3446.9],
    ],
    [
      [101.9,3847.7],
      [-104.7,4018.5],
      [-229.8,4364.3],
      [-156.3,4716.9],
      [126,4983.8],
      [423.7,5008],
      [790.7,4967.8],
      [1035.6,4813.1],
      [1190.8,4662.7],
    ],
    [
      [2199.3,2580.6],
      [2290.7,2695.9],
      [2505.2,2772.2],
      [2692.1,2739.5],
      [2877.9,2601],
      [2946.1,2433.6],
    ],
    [
      [1508.2,5547.4],
      [1515,5774.3],
      [1651.2,6028.6],
      [1903.2,6163.8],
      [2223.1,6195.6],
      [2472.9,6143.8],
      [2609.2,6032.6],
    ],
    [
      [3177.4,5956.9],
      [3196.4,6120.2],
      [3283.8,6238.5],
      [3424.6,6314.7],
      [3542.4,6310.9],
    ],
    [
      [3768.8,6017],
      [3969.1,6040.7],
      [4169.7,6148.1],
      [4304.9,6243.1],
      [4411.8,6394.6],
      [4452.4,6549.1],
    ],
    [
      [3987.1,6813.4],
      [4199,6771.9],
      [4406,6679.2],
      [4654.3,6480.6],
      [4789.5,6266.9],
      [4853.7,5973],
      [4840.7,5746.5],
      [4793.1,5639.3],
    ],
    [
      [4717.7,7085.5],
      [4866,7160.6],
      [5217.4,7108.3],
      [5432.7,7006.2],
      [5614.5,6845.5],
      [5787.5,6604.9],
      [6097.6,6387.1],
      [6375.3,6315.6],
      [6772.7,6256.4],
      [7095.2,6202.4],
      [7440.1,6065.4],
      [7632.2,5862.6],
      [7684.4,5731.7],
    ],
    [
      [4717.7,8127.1],
      [4825.3,8430.7],
      [5128.9,8663.3],
      [5528,8693.1],
      [5820.2,8615.6],
      [6157.2,8335.5],
      [6224.5,8162.8],
    ],
    [
      [6886.4,5833],
      [7053,5523.6],
      [7398.6,5094],
      [7746.2,4808.6],
      [8018,4678.1],
      [8126.3,4651.1],
    ],
  ],
};

// Update settings coordinates because they come from a SVG that is not exactly aligned with node coordinates
const xOffset = -4420
const yOffset = 4300
const pointTransformer = point => {
  point[0] = xOffset + point[0]
  point[1] = yOffset - point[1]
}
const xyTransformer = d => {
  d.x = xOffset + d.x
  d.y = yOffset - d.y
}
scopus2Settings.basemapPolygons.forEach(polygon => {
  polygon.forEach(pointTransformer)
})


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