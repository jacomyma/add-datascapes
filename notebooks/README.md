#  ADD Datascapes Notebooks
Notebooks to prepare the data for the datascapes of the project Algoritmer Data og Demokrati

## License
This project is licensed under the GNU General Public License v3.0.

## Authors
Mathieu Jacomy, Anders Kristian Munk and Snorre Ralund.

## How to use
The three mail files are Jupyter notebooks. Open them in Jupyter or compatible systems like Google Colab, and execute them in order. Follow their instructions about how to use them.
* ```01_Prepare_Infomedia_Data.ipynb``` cleans the data, extracts and exports a network of named entities.
* ```02_Ingest_Infomedia_Prepared_Data.ipynb``` ingests the data into an ElasticSearch cluster.
* ```03_Format_for_datascape.ipynb``` formats the network or named entities for the datascapes. It requires that you do the layout of the network in Gephi.

## SAMPLE DATA
A fake dataset compatible with the notebooks is provided: ```Infomedia raw data SAMPLE.csv```. Its data is in fact from Wikipedia, but it has expected format (from Infomedia).
