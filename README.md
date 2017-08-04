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
    DISCOVERY_VERSION=2016-11-07
    ```

Get more help [Getting started with the Discovery API](https://www.ibm.com/watson/developercloud/doc/discovery/getting-started.html)

## About Watson Discovery News

Watson Discovery News is a dataset of primarily English language news sources that is updated continuously, with approximately 300,000 new articles and blogs added daily.

This indexed dataset is pre-enriched with the following cognitive insights: Keyword Extraction, Entity Extraction, Concept Tagging, Relation Extraction, Sentiment Analysis, and Taxonomy Classification.

The following additional metadata is also added: crawl date, publication date, URL ranking, host rank, and anchor text. Historical search is available for the past 60 days of news data.

## Using the Watson Discovery Service
This application demonstrates how Watson Discovery Service can be used to query the Watson Discovery News dataset to find articles or quotes about a person. The sentiment of the documents retrieved are analysed using the pre-enriched with cognitive insights added to News dataset. These results are then output to a file.

To use this application, run `npm install` to install the required node.js packages:
  ```sh
  npm install
  ```
Verify the application is working correctly by running `./analysis.sh -h`. This should output the following help about the app:

  ```sh
    Usage: analysis.sh [options]

    Cognitive analysis of Watson Discovery News data.

    Options:

      -h, --help               output usage information
      -V, --version            output the version number
      -n, --name [name]        person name.
      -d, --dir [dir]          Directory to output results to.
      -p, --personality        Use Watson Personality Insights.
  ```
Use the `-n` flag to pass in a name to search on. Use the -`d` flag to specify a relative directory to write the results to. The following query will analyse the News dataset for articles about the tennis player Roger Federer:
  ```sh
  ./analysis.sh -n Federer -d results
  ```
The analysis of this query have been output as comma separated values to `results/Federer.csv`.
  ```none
  "name","hits","hits_negative","hits_positive","hits_neutral"
  "federer",50,14,28,8
  ```
The application has analysed the sentiment of each articles found about `Federer`. In total, there were 50 hits found, 14 of these had a negative sentiment, 28 had a positive sentiment and 8 had a neutral sentiment.



Use the `-q` flag to look for quotes about a particular person. The following query will analyse the News dataset for quotes about the tennis player Roger Federer:

  ```sh
  ./analysis.sh -n Federer -d results -q
  ```
The analysis of this query have been output as comma separated values to `results/Federer.csv`.
  ```none
  "name","hits","hits_negative","hits_positive","hits_neutral"
  "federer",65,19,0,46
  ```

The application has analysed the sentiment of each quote found about `Federer`. In total, there were 65 quotes found, 19 of these had a negative sentiment, zero had a positive sentiment and 46 had a neutral sentiment.

To output the quotes returned from Watson Discovery Service to the console, uncomment `console.dir(data);` on Line 22 in `analysis-quotes.js`.

### How Watson Discovery Service works
The IBM Watson&trade;Discovery service offers powerful content search capabilities using the [Discovery Query Language](https://www.ibm.com/watson/developercloud/doc/discovery/query-reference.html). In this application, a query object is formed in `discoveryQuery.js`, before using the node.js `request` library to send an HTTP GET to the specified endpoint:

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

Entity Extraction enrichment extracts persons, places, and organizations in the input text. The above query string filters for articles with the entity type `Person` and then searches for articles with the parameter `name` in the entity text. The `name` parameter has been passed in at the command line. Fifty results are return from Watson Discovery service, as specified by `count: 50`.

To retrieve quotes the query string looks like this:

  ```javascript
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'entities.text:('+name+')',
    filter: 'entities.type:Person,'
          + 'entities.quotations.sentiment.type::(neutral|positive|negative)',
    return: 'entities.quotations,'
          + 'entities.text,'
          + 'quotations.quotation,'
          + 'entities.type',
    count: 50
  };
  ```
In this case the query string filters for articles with the entity type `Person` and `quotations` with a `sentiment`. Only a subsection of each result is returned as specified by `return:`.

More details on query strings can be found [here](https://www.ibm.com/watson/developercloud/doc/discovery/query-reference.html).

## Using Personality insights
The IBM Watson&trade; Personality Insights service allows applications to derive insights about personality characteristics from social media, enterprise data, or other digital communications. This application can be used to analyse the personality of an individual using IBM Watson&trade; Personality Insights based on quotes retrieved from the IBM Watson&trade; Discovery service

To use the IBM Watson&trade; Discovery Service together with the IBM Watson&trade; Personality Insights service, complete the following steps in addition to the Prerequisites steps stated above:
1. Connect to Bluemix with the command line tool.

    ```sh
    bx api https://api.eu-gb.bluemix.net
    bx login -u <your user ID>
    ```

1. Create the Personality Insights service in Bluemix (if you have a trial account, replace `tiered` with `lite`)

    ```sh
    bx service create personality_insights tiered my-personality-insights-service
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
    DISCOVERY_VERSION=2016-11-07
    PERSONALITY_URL=https://gateway.watsonplatform.net/personality-insights/api/v3/profile
    PERSONALITY_USERNAME=<personality-insights-serivce-username>
    PERSONALITY_PASSWORD=<personality-insights-serivce-password>
    PERSONALITY_VERSION=2016-10-20
    ```

Get more help [Getting started with the Personality Insights API](https://www.ibm.com/watson/developercloud/doc/personality-insights/getting-started.html)

Use the `-p` flag with the `-q` flag to analyse the personality of a particular person. The following query will retrieve quotes  from the Watson Discovery New dataset about the tennis player Roger Federer, before sending them to your instance of the Personality Insights service:

  ```sh
  ./analysis.sh -n Federer -d results -q -p
  ```
The analysis of this query have been output as comma separated values to `results/Federer.csv`.

  ```none
  "name","openness","emotionalRange","conscientiousness","agreeableness","extraversion"
  "federer",0.31142288181635164,0.755908433280148,0.8428408846691722,0.010573124252825084,0.0022307444673070886
  ```

The application has analysed the personality of the quotes found about `Federer` using the Personality Insights service and provided values for the [Big Five](https://www.ibm.com/watson/developercloud/doc/personality-insights/models.html#outputBigFive) personality characteristics. The percentile returned for each characteristic reports the `Federer's` normalized score for that characteristic; the Personality Insights service computes the percentile by comparing the author's results with the results from a sample population.

To output the quotes returned from Watson Discovery Service to the console, uncomment `console.dir(data);` on Line 22 in `analysis-quotes.js`.

# Using Vagrant to run this application
A vagrant file in this project creates a Virtual Machine configured to run this project.
## Prerequisites
1. [Vagrant](https://www.vagrantup.com)
2. Instances of Watson Services running on Bluemix.

The project needs to be configured to work with your instances of the Watson Services.  Rename ````.env.template```` to ````.env```` and edit the properties in the file to point at your Watson service instances.

  ```sh
  vagrant up
  ssh vagrant
  cd /vagrant
  npm install
  ./analysis.sh -h
  ```



  ### TEMP DARREN
  filter(enriched_text.categories.label:/sports/tennis).term(author, count:100)
