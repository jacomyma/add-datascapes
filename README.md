#  ADD Datascapes
Datascape prototypes for the project Algoritmer Data og Demokrati

## License
This project is licensed under the GNU General Public License v3.0.
See the [```LICENSE```](https://github.com/jacomyma/add-datascapes/blob/main/LICENSE) file.

## Authors
Mathieu Jacomy, Anders Kristian Munk and Snorre Ralund.

## How to use

You will need:
* a data set from Infomedia (or equivalent), in Danish.
* Jupyter or equivalent to run the notebooks
* access to an ElasticSearch engine
* [Gephi](https://gephi.org/) to spatialize the obtained network
* somewhere to host the datascape (a static website)

### 1. Prepare the data with the notebooks.

Follow the instructions from the [```notebooks```](https://github.com/jacomyma/add-datascapes/tree/main/notebooks) folder's README, and the notebooks themselves. It takes time. The three basic steps are:
* Extract named entities from the source data set
* Ingest them into the ElasticSearch engine
* Do the layout in Gephi and format it for the datascape front-end

### 2. Install the datascape's front-end

Follow instructions from the [```datascape-template```](https://github.com/jacomyma/add-datascapes/tree/main/datascape-template) folder's README. I recommend that you duplicate that folder before you change it.

Those instructions suppose that you already have set up:
* An ElasticSearch engine containing the documents to display
* A CSV file containing the words or expressions extracted from those files, and their coordinates in the basemap. You obtain this file from the [```notebooks```](https://github.com/jacomyma/add-datascapes/tree/main/notebooks) and Gephi.
