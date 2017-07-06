---
layout: post
title:  "What Makes a Great Wimbledon Champion"
date:   2017-07-06 08:00:00 +0000
categories: work
excerpt: IBM has been supporting Wimbledon’s pursuit of greatness for 27 years. In recent years, much of that contribution has come from the Hursley based Emerging Technology team. This year’s challenge? To find out what makes the greatest Wimbledon champion of all time.
author: Rosie Lickorish
---
IBM has been supporting Wimbledon's pursuit of greatness for 27 years. In recent years, much of that contribution has come from the Hursley based Emerging Technology team. This year’s challenge? To find out what makes the greatest Wimbledon champion of all time.

A team of statisticians, tennis analysts, coaches, journalists and developers assembled to start exploring this open ended question. It was clear from the start that each expert had a different point of view about what makes a great Wimbledon champion. And there was a further point of view to consider, that of IBM Watson, a cognitive tool that generates unique insight through its ability to understand natural language and analyse unstructured data.

## IBM Watson
The Emerging Technology team took the lead on using the cognitive capabilities provided by Watson, like the ability to understand natural language and interpret sentiment, to explore what makes a great Wimbledon champion. We provided Watson with over 25 years of tennis data from articles, blogs and interviews. 350,256 documents in total.

Once the structure of the data was understood, we added the content to the <a href="https://www.ibm.com/watson/developercloud/doc/discovery/index.html">Watson Discovery Service (WDS)</a>. With the data stored in WDS, we started to write queries to pinpoint the information we needed. A key benefits to using Watson was how quickly we were set up and extract meaning from the data.  The Watson services lower the barriers to machine learning, allowing developers to solve problems that would previously have required deep AI skills.

To add another dimension to our analysis we explored player personalities using <a href="https://www.ibm.com/watson/developercloud/doc/personality-insights/index.html">Watson Personality Insights</a>, a service that allows applications to derive insights about personality characteristics. We passed Watson quotes and interview extracts from players. Watson then used linguistic analytics to infer an individuals' intrinsic personality characteristics, providing us with further insight into what make a great Wimbledon champion.

Watson provides a powerful set of APIs making it possible to run multiple queries with a range of parameters. We found the most efficient way of analysing the 32 players (shortlisted by tennis experts to be the greatest), was to package the API calls into scripts. These scripts would then run the queries, organise the data returned and output the results into spreadsheets. With the query results for each player in this format, we quickly started to identify trends in the data. One great example of this is the data returned from Personality Insights which became instantly digestible the moment it was added to a radar diagram, for instance Andy Murray’s personality profile using the <a href="https://www.ibm.com/watson/developercloud/doc/personality-insights/models.html#outputBigFive">Big Five personality model</a>.

Our analysis gave some fantastic insight into the corpus of unstructured data. In the weeks leading up to Wimbledon, we met with the wider editorial team (statisticians, sports journalists and tennis coaches) to piece together the findings from the different points of view. Sometimes Watson indicated a number of trends that hadn’t yet been seen in the statistics. At others the statistical data supported the cognitive insights. And on occasions, the cognitive analyses even challenged conventional ideas of greatness.

An example of this was discovering introversion to be a consistent personality trait among the 32 champions. It could easily be perceived that an outgoing, energetic and assertive personality, an extrovert, would help someone progress to the top of a sports career. Watson Personality Insights challenged this stereotype by showing that in fact key, characteristics to greatness in tennis are independence, demureness and seriousness.  Introverts make great Wimbledon champions.

One of the biggest challenges was tackling a question where there wasn’t a definitive answer. With Watson, developers are now able to look for answers to subjective questions. Often the questions Watson prompted were as valuable as the insights, leading to an iterative process of discovery.

## The debate continues
Although our analysis uncovered some exciting findings, the topic remains up for debate. To contribute and add your opinion, get involved in the daily #WhatMakesGreat discussions. Follow <a href="https://twitter.com/intent/follow?screen_name=IBM_UK_News">@IBM_UK_News</a> and <a href="http://ibmsports/">@IBMSports</a> on Twitter for the latest #WhatMakesGreat and IBM@Wimbledon content.

For anyone interested in getting up and running with Watson services, sample code is available
showing how to use Watson Discovery Service and Watson Personality Insights. Both services are available to try for free. Discovery Service comes with a data set of news sources that are updated continuously. https://github.com/ibmets/discovery-service-with-personality-insights
