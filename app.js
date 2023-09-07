const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
const app = express();
app.use(express.json());
require('./helper/initRedis')
require('./helper/initDB')();
app.use(morgan('dev'))
const path = require('path')
const ProductRoute = require('./routes/product.route');
const AuthRoute = require('./routes/auth.route');
const { send } = require('process');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', ProductRoute);
app.use('/auth', AuthRoute);

app.use((req, res, next) => {
    next(createError.NotFound())

})


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
})


// const upload = multer({
//     dest:'./upload/images'
// })

// app.post("upload", upload.single('profile'), (req, res)=>{
//     console.log(req.file)
//     res.send(res)
// })