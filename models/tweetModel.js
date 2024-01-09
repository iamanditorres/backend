const mongoose = require('mongoose')
const Schema = mongoose.Schema

// TODO: change the Schema to fit the needed data
// format of the data:
const tweetSchema = new Schema({
    id: {
        type: String,
        required: false,
        index: true,
        unique: true,
        dropdups: true
    },
    text: {
        type: String,
        required: checkText
    },
    classification: {
        type: String,
        required: true
    },
    prediction :{
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    }
}, {timestamps: true})

function checkText(){
    return typeof this.text === 'string'? false : true
}

module.exports = mongoose.model('Tweet', tweetSchema)