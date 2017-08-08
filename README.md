# Watson Discovery Service with Personality Insights
IBM Watson&trade; Discovery Service unlocks insights hidden in unstructured data. This node.js application demonstrates how the Discovery API can be used to build queries and perform cognitive analysis using the Watson Discovery News dataset.

## Prerequisites
1. A Bluemix account. If you don't have one, [sign up](https://console.eu-gb.bluemix.net/registration/).

2. node.js (alternatively, this project can run using [Vagrant](https://www.vagrantup.com). A Vagrant file has been provided which creates a Virtual Machine configured to run this project.)

## Getting started
1. Download this project using `git clone`.
1. Download and install the [Cloud-foundry CLI](https://github.com/cloudfoundry/cli) tool if you haven't already.
1. Connect to Bluemix with the command line tool.

    ```sh
    bx api https://api.eu-gb.bluemix.net
    bx login -u <your user ID>
    ```

1. Create an instance of the Discovery service:

    ```sh
    bx service create discovery lite my-discovery-service
    ```

1. Create and retrieve service keys to access your instance of the Discovery service:

    ```sh
    bx service key-create my-discovery-service myKey
    bx service key-show my-discovery-service myKey
    ```

1. The project needs to be configured to work with your instances of the Watson Discovery Services. Rename `.env.template` to `.env`. Fill in `.env` with your service instance information. The `.env` file will look something like the following:

    ```none
    DISCOVERY_USERNAME=<username>
    DISCOVERY_PASSWORD=<password>
    DISCOVERY_ENVIRONMENT_ID=
    DISCOVERY_COLLECTION_ID=
    DISCOVERY_CONFIGURATION_ID=
    DISCOVERY_VERSION=2017-08-01
    ```


1. Use the `GET /v1/environments/system/collections` method to get the collection ID and configuration ID of your Watson News Environment instance.

    ```sh
    curl -X GET -u "{username}":"{password}" "https://gateway.watsonplatform.net/discovery/api/v1/environments/system/collections?version=2017-08-01"
    ```
    ```sh
      {
        "collections" : [{
          "collection_id" : "news",
          "name" : "news",
          "language" : "en",
          "status" : "active",
          "description" : "Watson News pre-enriched collection of curated news sources v2"
        }]
      }
    ```

1. Fill in `.env` with your environment and collection and IDs. The `.env` file will look something like the following:

    ```none
    DISCOVERY_USERNAME=<username>
    DISCOVERY_PASSWORD=<password>
    DISCOVERY_ENVIRONMENT_ID=system
    DISCOVERY_COLLECTION_ID=news
    DISCOVERY_VERSION=2017-08-01
    ```

Get more help [Getting started with the Discovery API](https://www.ibm.com/watson/developercloud/doc/discovery/getting-started.html)

## About Watson Discovery News

Watson Discovery News is a dataset of primarily English language news sources that is updated continuously, with approximately 300,000 new articles and blogs added daily.

This indexed dataset is pre-enriched with the following cognitive insights: Keyword Extraction, Entity Extraction, Concept Tagging, Relation Extraction, Sentiment Analysis, and Taxonomy Classification.

The following additional metadata is also added: crawl date, publication date, URL ranking, host rank, and anchor text. Historical search is available for the past 60 days of news data.

## Using the Watson Discovery Service
This application demonstrates how Watson Discovery Service can be used to query the Watson Discovery News dataset to analyse authors of sports articles.

To use this application, run `npm install` to install the required node.js packages:

```sh
  npm install
```
Verify the application is working correctly by running `./analysis.sh -h`. This should output the following help about the app:

```sh
  Usage: analysis.sh [options] [command]

  Options:

  -V, --version  output the version number
  -h, --help     output usage information


  Commands:

  authors <category> <dir>  
  personality <author> <dir>
  sentiment <author> <dir>  
```

The command `authors` will find the top authors for a given category, `sentiment` and `personality` will analyse the personality or sentiment of a given author.  All commands require a directory path for the output to be written to.

The following command will find the top authors for news articles in the /sports/tennis category:
```sh
  ./analysis.sh authors /sports/tennis data/authors
```

The following command will analyse the news dataset for the mean sentiment for articles written by "Tennis World":

```sh
  ./analysis.sh sentiment "Tennis World" data/sentiment
```
### How Watson Discovery Service works
The IBM Watson&trade; Discovery service offers powerful content search capabilities using the [Discovery Query Language](https://www.ibm.com/watson/developercloud/doc/discovery/query-reference.html). In this application, a query object is formed in `discoveryQuery.js`, before using the node.js `request` library to send an HTTP GET to the specified endpoint:

  ```javascript
  var queryUri = 'https://gateway.watsonplatform.net/discovery/api/v1/environments/'+process.env.DISCOVERY_ENVIRONMENT_ID+'/collections/'+process.env.DISCOVERY_COLLECTION_ID+'/query';
  var queryObject = {
    uri: queryUri,
    method: 'GET',
    auth: {
      user: process.env.DISCOVERY_USERNAME,
      pass: process.env.DISCOVERY_PASSWORD
    }
  };
  ```
Query parameters enable you to search your collection, and customise the output of the data you return. A query string is added to the query object as follows:

  ```javascript
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'entities.text:('+name+')',
    filter: 'entities.type:Person',
    count: 50
  };
  ```  
Search and structure parameters determine what data is returned:

- filter: A cacheable query that excludes any documents that don't mention the query content. Filter search results are not returned in order of relevance.
- query: A query search returns all documents in your data set with full enrichments and full text in order of relevance. A query also excludes any documents that don't mention the query content.
- count: The number of documents that you want returned in the response.
- aggregation: an aggregation query returns the result of an operation on a set of documents

More details on query strings can be found [here](https://www.ibm.com/watson/developercloud/doc/discovery/query-reference.html).

## Using Personality insights
The IBM Watson&trade; Personality Insights service allows applications to derive insights about personality characteristics from social media, enterprise data, or other digital communications.

To use the IBM Watson&trade; Discovery Service together with the IBM Watson&trade; Personality Insights service, complete the following steps in addition to the initial prerequisites above:
1. Connect to Bluemix with the command line tool.

    ```sh
    bx api https://api.eu-gb.bluemix.net
    bx login -u <your user ID>
    ```

1. Create the Personality Insights service in Bluemix (if you have a trial account, replace `tiered` with `lite`)

    ```sh
    bx service create personality_insights lite my-personality-insights-service
    ```

1. Create and retrieve service keys to access your instance of the Personality Insights service:

    ```sh
    bx service key-create my-personality-insights-service myKey
    bx service key-show my-personality-insights-service myKey
    ```

1. The project needs to be configured to work with your instances of the Watson Personality Insights Services. You will have previously renamed `.env.template` to `.env`. Fill in `.env` with your service instance information. The `.env` file will look something like the following:

    ```none
    DISCOVERY_USERNAME=<username>
    DISCOVERY_PASSWORD=<password>
    DISCOVERY_ENVIRONMENT_ID=<environment_id>
    DISCOVERY_COLLECTION_ID=<collection_id>
    DISCOVERY_CONFIGURATION_ID=<configuration_id>
    DISCOVERY_VERSION=2017-08-01
    PERSONALITY_URL=https://gateway.watsonplatform.net/personality-insights/api/v3/profile
    PERSONALITY_USERNAME=<personality-insights-serivce-username>
    PERSONALITY_PASSWORD=<personality-insights-serivce-password>
    PERSONALITY_VERSION=2016-10-20
    ```

Get more help [Getting started with the Personality Insights API](https://www.ibm.com/watson/developercloud/doc/personality-insights/getting-started.html)

Use the "personality" command to analyse the personality of a specific author. The following command will find articles written by the author "Tennis World", send them to your instance of Personality Insights and output the personality attributes that the service finds..

```sh
  ./analysis.sh personality "Tennis World" data/personality
```

The analysis of this query have been output as comma separated values to `data/personality/personality_tennis_world.csv`.

  ```none
    "openness","emotionalRange","conscientiousness","agreeableness","extraversion"
    "0.31142288181635164,0.755908433280148,0.8428408846691722,0.010573124252825084,0.0022307444673070886
  ```

The application has analysed the personality of articles written by "Tennis World" using the Personality Insights service and provided values for the [Big Five](https://www.ibm.com/watson/developercloud/doc/personality-insights/models.html#outputBigFive) personality characteristics. The percentile returned for each characteristic reports the author's normalized score for that characteristic; the Personality Insights service computes the percentile by comparing the author's results with the results from a sample population.


# Using Vagrant to run this application
A vagrant file in this project creates a Virtual Machine configured to run this project.
## Prerequisites
1. [Vagrant](https://www.vagrantup.com)
2. Instances of Watson Services running on Bluemix.

The project needs to be configured to work with your instances of the Watson Services.  Rename ````.env.template```` to ````.env```` and edit the properties in the file to point at your Watson service instances.

  ```sh
  vagrant up
  vagrant ssh
  cd /vagrant
  npm install
  ./analysis.sh -h
  ```
