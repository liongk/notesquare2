const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){//cb is callback
        cb(null, 'uploads')//cb(err, destination). There is null error (no), and we want ther file to enter the uploads destination

    },
    filename: function(req, file, cb){
        //fieldname is based off the 'name' attribute in the html input form. - this is 'file'
        cb(null, file.fieldname+Date.now()+path.extname(file.originalname))
                                    //append current date and original extname => mp4, jpeg, png, pdf, etc.   
        //An example would be: file1598713127441.pdf
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        if(file.mimetype == 'application/pdf'){
            cb(null, true)
        }else{
            console.log('filetype has to be pdf')
            cb(null, false)
        }
    }, limits:{
        fileSize: 1024 * 1024 * 4 //max filesize is 4mb
    }
})

module.exports = upload

