// TODO: to rename

// require express package
const express = require('express') 

const {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
} = require('../controllers/workoutController')

// instance of router
const router = express.Router()

// attach to handler
// route for /
router.get('/', getWorkouts)

// route for /hello
router.get('/:id', getWorkout)

// POST
router.post('/', createWorkout)

// DELETE
router.delete('/:id', deleteWorkout)

// UPDATE
router.patch('/:id', updateWorkout)

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

// export the router
module.exports = router