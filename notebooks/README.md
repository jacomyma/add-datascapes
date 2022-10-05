#  ADD Datascapes Notebooks
Notebooks to prepare the data for the datascapes of the project Algoritmer Data og Demokrati

## License
This project is licensed under the GNU General Public License v3.0.
See the [```LICENSE```](https://github.com/jacomyma/add-datascapes/blob/main/LICENSE) file.

## Authors
Mathieu Jacomy, Anders Kristian Munk and Snorre Ralund.

## How to use
The three main files are Jupyter notebooks. Open them in Jupyter or compatible systems like Google Colab, and execute them in order. Follow their instructions (each one explains how to use it). In short:
* ```01_Prepare_Infomedia_Data.ipynb``` cleans the data, extracts and exports a network of named entities.
* ```02_Ingest_Infomedia_Prepared_Data.ipynb``` ingests the data into an ElasticSearch cluster.
* ```03_Format_for_datascape.ipynb``` formats the network or named entities for the datascapes. It requires that you do the layout of the network in Gephi.

## SAMPLE DATA
A fake data set compatible with the notebooks is provided: ```Infomedia raw data SAMPLE.csv```. The data are in fact from Wikipedia, but the file has the expected format (the same as Infomedia data).
