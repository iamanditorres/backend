// require express package
const express = require('express') 

// instance of router
const router = express.Router()

// unpack functions
const {
    getTweets,
    getTweet,
    createTweet,
    deleteTweet,
    updateTweets,
    pullTweets,
    createDictionary
} = require('../controllers/tweetController')

/*
    Code for all the routes
*/

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

// route for updating a tweet
router.patch('/updateTweets', updateTweets)

// test
router.get('/pullTweets', pullTweets)

// route for getting dictionaries
router.post('/pullDictionaries', createDictionary)



// route for getting all tweets
router.get('/', getTweets)

// route for getting one tweet
router.get('/:id', getTweet)

// route for creating a tweet
// Should load all tweets from the dummy data
router.post('/', createTweet)

// route for deleting a tweet
router.delete('/:id', deleteTweet)



// export the router
module.exports = router