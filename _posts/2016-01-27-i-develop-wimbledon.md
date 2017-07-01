---
layout: post
title:  "I Develop for Wimbledon: Rosie Lickorish and Darren Shaw"
date:   2017-07-01 08:00:00 +0000
categories: work
excerpt: Nadal often comments that he doesn’t play well in the cold. However, IBM Watson analytics found he actually plays equally well, if not slightly better in cooler temperatures – see the full article in the Telegraph. And Federer is noted for not being a very sweaty tennis player. Combing through data produced a theory that he tends to play much shorter games than other players – could this be the cause after all?
author: Emma Grove
---
Nadal often comments that he doesn’t play well in the cold. However, IBM Watson analytics found he actually plays equally well, if not slightly better in cooler temperatures – see the full article in the Telegraph. And Federer is noted for not being a very sweaty tennis player. Combing through data produced a theory that he tends to play much shorter games than other players – could this be the cause after all?

The question Could Watson services help explore “What makes a great Wimbledon champion?” was put to Hursley Labs’ Emerging Technology developers, Darren and Rosie. Their Wimbledon Watson solution worked by combining traditional structured data, like statistics, and unstructured data, such as text and webpages. In fact, over 22 years of articles, ten books and over 53 million tennis data points were all analysed by Watson.

One interesting finding came through Watson analysing a top female player’s interviews. In an early interview she commented on her opponent’s ability to return serve. In another interview a few days later, Watson identified her talking about needing to improve her own return. Analysing later interviews, plus tennis commentary on her play, Watson suggested her own return was something she had deliberately improved on, and was turning in to a strength.

Out of this particular example, Watson identified what makes a great player is the ability to assess opponents’ strengths, and to focus and drive to improve themselves, even when they’re right at the top. What Watson has done that is impressive, is to connect those interviews together. Rosie commented: “I don’t think we’d be able to do this any other way at that pace.”

## Behind the scenes
But how does it all happen? Darren and Rosie went through two main stages. The first stage is human, looking at sample documents, and telling Watson what to expect. It took between two and three days to explore the format of the documents. The team must manage differences between input sources, such as from the wimbledon.com archive, and the Telegraph newspaper. In stage two, they fed the documents into Watson, which took about 3-4 hours of input and processing time.

The analysis was done using Watson Discovery Service and Personality Insights running in Bluemix. The advantages of using these services is that you don’t need to be an AI expert to use them. Basic developer knowledge and a couple of hours with the documentation and examples is enough to start getting results. This is a change from just a couple of years ago where you needed a deep knowledge of AI to tackle this class of problems. Opening the field up means a much wider range of applications can make use of AI.

This project is quite different to other Watson ones because of the short-term nature of the Wimbledon Championships and the completely fixed deadline. The tennis will start on 3 July, regardless of the state the technology is in. Using Watson Discovery Service is an iterative process. Pulling out one insight often leads to a new set of follow-on questions that might need a new way of structuring the data or perhaps a whole new data source. Having the fixed deadline means developing a feel for which questions might lead to the most insight.

## The future?
And where next for Darren and Rosie?

“We have seen that our analysis triggers other ideas, and often forces us to question common assumptions that exist in sport. One of the things we’ve found again and again is that the questions Watson gives us are as valuable as its answers. We’ve only scratched the surface of the data we could analyse, we’d love to do more work with images and video and combine data sources from other sports.”
