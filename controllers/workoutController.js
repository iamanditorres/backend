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

const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// get all workouts
const getWorkouts = async (req, res) => {
    // get all workout documents
    const workouts = await Workout.find({}).sort({createdAt:-1})
    
    // send documents to the browser
    res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async(req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    // retrieve using the id
    const workout = await Workout.findById(id)

    // if no workout was found
    if (!workout) {
        // we return to early exit
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(workout)
}


// create new workout
const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body

    let emptyFields = []

    if (!title) { emptyFields.push('title') }
    if (!load) { emptyFields.push('load') }
    if (!reps) { emptyFields.push('reps') }
    if (emptyFields.length > 0) { return res.status(400).json({ error: 'Please fill in all the fields.', emptyFields})}
    
    // add document to db
    try {
        const workout = await Workout.create({title, load, reps})
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a workout
const deleteWorkout = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    // delete by id
    const workout = await Workout.findOneAndDelete({_id: id})

    // if no workout was found
    if (!workout) {
        // we return to early exit
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(workout)
}


// update a workout
const updateWorkout = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    // delete by id
    const workout = await Workout.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    // if no workout was found
    if (!workout) {
        // we return to early exit
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(workout)

}
module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}