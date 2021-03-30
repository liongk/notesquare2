const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    dateCreated:{
        type: Date,
        default: Date.now()
    },
    file:{
        data: Buffer,
        contentType: String
    },
    text:{
        type: String,
        required: true
    },
    topic:{
        type: String,
        required: true
    }, //JUST ONE!!!!!!!
    grade:{
        type: Number,
        required: true
    }//CHECKBOX
})

const noteModel = new mongoose.model('Note', noteSchema)
module.exports = noteModel