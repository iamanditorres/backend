const mongoose = require('mongoose')
const Schema = mongoose.Schema

// TODO: change the Schema to fit the needed data
// format of the data:
const workoutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Workout', workoutSchema)