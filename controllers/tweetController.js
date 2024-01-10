/*
    TODO:
    [ ] get one
    [ ] get all
    [ ] create one
    [ ] update one
    [ ] delete one
    [ ] delete all
    [ ] create many
*/

const express = require('express')
const underscore = require('underscore')
const Tweet = require('../models/tweetModel')
const mongoose = require('mongoose')

// get all tweets
const getTweets = async (req, res) => {
    const tweets = await Tweet.find({}).sort({createdAt:-1})
    res.status(200).json(tweets)                               
}

// get a single tweet
const getTweet = async(req, res) => {
    // get id from req
    const {id} = req.params 

    // early exit if invalid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such tweet'})
    }

    // retrieve using the id
    const tweet = await Tweet.findById(id)

    // early exit if no tweet matches
    if (!tweet) {
        return res.status(404).json({error: 'No such tweet'})
    }

    res.status(200).json(tweet)
}

/* 
    where we retrieve tweets
    Simulated only, JSON files are actual data from Twitter
    but is hosted in github
*/
// create new tweet
const createTweet = async (req, res) => {
    // destructure information from req.body
    const {id, text, classification, location} = req.body

    // add document to db
    try {
        const tweet = await Tweet.create({id, text, classification, location})
        res.status(200).json(tweet)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a tweet
const deleteTweet = async (req, res) => {
    // get id from req
    const {id} = req.params

    // early exit if id is invalid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    // delete by id
    const tweet = await Tweet.findOneAndDelete({_id: id})

    // early exit if no tweet matches
    if (!tweet) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(tweet)
}

// update a tweet
const updateTweets = async (req, res) => {
    // get update request from the body
    const update_request = req.body

    // collect updates
    const updateQueries = [];
    update_request.forEach(async(element) => {
        updateQueries.push({
            updateOne : {
                filter: {id:element["id"]},
                update: {prediction: element["prediction"]}
            },
        })
    });

    // send updates
    const classifiedTweets = Tweet.bulkWrite(updateQueries)

    if (classifiedTweets.length > 0){
        res.send(400).json({error: 'Failed to update.'})
    } else{
        res.status(200).json({message: "Success"})    
    }   
}

// fetch a JSON and format it
const fetchJSON = async (tempURL) => {
    // regex
    const regexClean = /[^a-zA-Z ,]/g
    const regexTag = /^@/
    const regexHash = /^#/
    const regexRTstart  = /^rt$/
    const regexRTend = /[…]/
    const regexEmojis =  /\p{Extended_Pictographic}/ug
    const regexHTML = /(http|https):\/\//

    // fetch json file from the URL
    let data = await (await fetch(tempURL)).json()

    // get the modified data from the twitter api json file
    let rawText = data.data

    // do not add tweets without classifications
    let cleanText = rawText.filter((val) => val.classification.length != 0)

    // delete unused fields
    for (val of cleanText){
        // preliminary cleanup
        let text = val['text'].toLowerCase()            // get the text from each val
        let noQuotes = text.replace(/['"]/g, "")            // remove quotes
        let noEmojis = noQuotes.replace(regexEmojis, " ")   // remove emojis
        let oneSpace = noEmojis.replace(/  +/g, ' ')        // remove extra spaces
        let textArray = oneSpace.split(/[ ,\n]+/)           // split to array

        // iterate through the array and remove certain symbols
        for (textVal in textArray){
            if (regexHTML.test(textArray[textVal])){ textArray[textVal] = " " }      // remove http-
            if (regexTag.test(textArray[textVal])){ textArray[textVal] = " " }       // remove @-
            if (regexHash.test(textArray[textVal])){ textArray[textVal] = " " }      // remove #-
            if (regexRTend.test(textArray[textVal])){ textArray[textVal] = " " }     // remove -...
            if (regexRTstart.test(textArray[textVal])){ textArray[textVal] = " " }   // remove RT
        }

        // replace val's text field with the cleaned string
        val['text'] = textArray.join(" ").replace(regexClean, "").replace(/  +/g, ' ').trim()

        // remove unused fields
        delete val['edit_history_tweet_ids']
        delete val['geo']
    }

    return cleanText
}

/*
    - Simulates pulling from twitter API
    - The .json files pulled were manually tagged with a classification and a location
    - The .json files are hosted in Github
        - source: https://juniortoexpert.com/en/how-to-host-json-on-github/

    TODO:
    - Create a selector for the file to be read
*/
const pullTweets = async (req, res) => {
    const baseURL = new URL("https://raw.githubusercontent.com/iamanditorres/aster-raw-data/main/JSON/")

    const dataset = ["dataset_21_phil.json",
    "dataset_22_phil_disaster.json",
    "dataset_23_habagat.json",
    "dataset_23_phil_assistance.json",
    "dataset_23_phil_chaos.json",
    "dataset_23_phil_dead.json",
    "dataset_23_phil_death.json",
    "dataset_23_phil_donation.json",
    "dataset_23_phil_earthquake.json",
    "dataset_23_phil_emergency.json",
    "dataset_23_phil_fire.json",
    "dataset_23_phil_flood.json",
    "dataset_23_phil_help.json",
    "dataset_23_phil_marcos.json",
    "dataset_23_phil_pray.json",
    "dataset_23_phil_president.json",
    "dataset_23_phil_rain.json",
    "dataset_23_phil_showbiz.json",
    "dataset_23_phil_storm.json",
    "dataset_23_phil_typhoon.json",
    "dataset_23_phil_volcano.json",
    "dataset_23_phil_warning.json"]

    /**
     * For testing purposes only
     */
    // let faultyDataset = [
    //     "sample_faulty_data_1.json",
    //     "sample_faulty_data.json"
    // ]
    // let currentDataset = [
    //     "dataset_23_habagat.json"
    // ]


    let pooledTweets = []

    for (val of dataset) {
        // TODO: wrap in try catch
        const data = await fetchJSON((new URL(val, baseURL)).toString())
        pooledTweets.push(...data)
    }

    Tweet.insertMany(pooledTweets, {ordered: false, silent: true}).then((tweets) => {
        res.status(200).send(tweets)
    }).catch((error) => {
        console.log(error)
        res.status(400).send(error)
    })
}

/**
 * creating Dictionaries
 */

const createDictionary = async(req, res) => {
    /**
     * specifies how many tweets are put into the dictionary for the classifier
     * max of 17, since the max size of one of the classifications is 18
     * [!] will be changed once the tweets are reclassified
     */
    const MAX_VAL = 5 

    let target = req.body.classification
    const possibleClassifications = ["No Severity", "Low Severity", "High Severity"]

    // early exit if there is no classification sent in the req.body
    if(!target){
        return res.status(404).json({error: 'No such classification'})
    }

    // early exit if the classification is invalid
    if(!possibleClassifications.includes(target)){
        return res.status(404).json({error: 'No such classification'})
    }

    // get tweets based on classification
    // TODO: wrap in try catch
    const filteredTweets = await Tweet.find({classification: target}).exec()

    // get random tweets from that classification
    let randomTweets = underscore.sample(filteredTweets, MAX_VAL)

    // store the word counts here
    let dict = {}

    // count the words for each text
    for (val of randomTweets){
        let splitText = val.text.split(" ")
        for (word of splitText){
            if (word in dict){
                dict[word] = dict[word] + 1
            }else{
                dict[word] = 1
            }
        }
    }

    // send back the data and the tweet ids used
    res.status(200).json(JSON.stringify({data: dict, ids: randomTweets.map(o => o.id)}))
}

module.exports = {
    getTweets,
    getTweet,
    createTweet,
    deleteTweet,
    updateTweets,
    pullTweets,
    createDictionary,
}