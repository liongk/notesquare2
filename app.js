//ES5
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs =  require('fs')
const path = require('path')
const fileUpload = require('express-fileupload');
// const crypto = require('crypto')//generate file names
// const GridFsStorage = require('multer-gridfs-storage')
// const Grid = require('gridfs-stream')
const app = express()
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/notesquaredemo')
const db = mongoose.connection //the connection is stored to a variable to help test the connection situation

db.on('error', function(err){   //in case of an error, console.log the problem
    console.log(err)
})

db.once('open', function(){     //if connection is open, console.log confirmation.
    console.log('database connection established')
})

const Note = require('./models/notemodel')

//morgan logs errors and requests 
app.use(morgan('dev'))

//bodyparser can process both data incoming in urlencoded AND Json format.
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(fileUpload()); // Don't forget this line!


//upload multer middleware
const storage = multer.diskStorage({ 
    destination:(req, file, cb) =>{
        cb(null,'uploads')
    },
    filename:(req, file, cb)=>{
        cb(null, file.fieldname+'-'+Date.now())
    }
})

const upload = multer({ storage: storage });

//@ROUTES

app.get('/', function(req, res){
    res.redirect('/notes')
})

app.get('/notes', function(req, res){

    Note.find({}, function(err, notes){
        if(err){
            console.log(err)
        }else{
            //res.json(notes)
            res.render('notes/index', {notes: notes})
        }
    })
})

app.get('/notes/new', function(req, res){
    res.render('notes/new')
})


app.post('/notes', upload.single('file'), (req, res, next)=>{
    newNote = {
        title: req.body.title,
        text: req.body.text, //description
        topic: req.body.topic,
        grade: req.body.grade,
        file: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Note.create(newNote, function(err, newPost){
        if(err){
            console.log(err)
            res.render('notes/new')
        }else{
            res.redirect('/notes')
        }
    })
})

app.get('/notes/:id', function(req, res){
    Note.findById(req.params.id, function(err, foundNote){
        if(err){
            console.log(err)
        }else{
            res.render('notes/show', {note: foundNote})
        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log('listening in port 3000.')
})
