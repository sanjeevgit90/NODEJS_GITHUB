const multer = require('multer')
const path = require('path')

// Set storage options for Multer
const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
})
// Initialize Multer with the storage options

const upload = multer({storage});
 module.exports = upload;