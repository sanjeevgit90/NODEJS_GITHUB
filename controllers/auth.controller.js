const createError = require('http-errors');
const User = require('../models/user.model');
const { userSchema, loginSchema } = require('../resources/authValidationSchema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helper/jwtHelper');
const client = require('../helper/initRedis');
require('../helper/message');
const { GET_ASYNC, SET_ASYNC } = require('../helper/common')

module.exports = {

    getUsers: async (req, res, next) => {
        try {
            const reply = await GET_ASYNC('USER')
            if (reply) {
                console.log('using cached data')
                res.send(JSON.parse(reply))
                return
            }
            console.log(req.query);
            const result = await User.find({}, { __v: 0 })
            const saveResult = await SET_ASYNC('USER', JSON.stringify(result), 'EX', 15)// Set data in redis memory
            console.log('New data cached', saveResult)
            // const result = await User.find(req.query)
            res.send(result)
        } catch (error) {
            next(error)
        }
    },

    filterUsers: async (req, res, next) => {
        try {
            const result = await User.find({
                firstName: { $regex: new RegExp(req.body.firstName, "i") },
                gender: { $regex: new RegExp(req.body.gender, "i") },
                mobileNo: { $regex: new RegExp(req.body.mobileNo, "i") }
            })
            res.send(result)
        } catch (error) {
            next(error)
        }
    },

    registerUser: async (req, res, next) => {
        try {
            console.log(req.headers['authorization']);
            console.log(req.body)
            delete req.body._id
            const result = await userSchema.validateAsync(req.body);
            const doesExist = await User.findOne({ email: result.email })
            if (doesExist)
                throw createError.Conflict(`${result.email} is already created`);
            const user = new User(result);
            const saveUser = await user.save();
            const accessToken = await signAccessToken(saveUser.id)
            const refreshToken = await signRefreshToken(saveUser.id)
            const message = userCreate;
            res.send({ accessToken, refreshToken, message })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getUserDetailsById: async (req, res, next) => {
        try {
            const result = await User.findById(req.params.id).select('-__v');
            if (!result) throw createError.NotFound('No user found')
            res.send(result)
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    updateUserById: async (req, res, next) => {
        try {
            const updateData = await userSchema.validateAsync(req.body);
            const result = await User.findByIdAndUpdate(req.body._id, updateData, { new: true }).select('-__v');
            const message = userUpdate;
            res.send({result, message})
        } catch (error) {
            next(error)
        }
    },

    deleteUserById: async (req, res, next) => {
        try {
            const result = await User.findByIdAndDelete(req.params.id).select('-__v');
            const message = userDelete;
            if (!result) throw createError.NotFound(userDoesNotExist);
            res.send({ result, message })
        } catch (error) {
            next(error)
        }
    },


    loginUser: async (req, res, next) => {
        try {
            const result = await loginSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })
            if (!user) throw createError.NotFound('User Not Registred')
            const isMatch = await user.isValidPassword(result.password)
            if (!isMatch) throw createError.Unauthorized('Username/Password not valid');
            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id);
            res.send({ accessToken, refreshToken, user })

        } catch (error) {
            console.log(error)
            if (error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }

    },

    refreshTokenMethod: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest()

            const userId = await verifyRefreshToken(refreshToken);
            console.log('userid', userId)
            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId)
            res.send({ accessToken: accessToken, refreshToken: refToken })

        } catch (error) {
            next(error)
        }
    },

    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            client.del(userId, (err, value) => {
                if (err) {
                    console.log(err.message);
                    throw createError.InternalServerError()
                }
                console.log(value)
                res.sendStatus(204)
            })
        } catch (error) {
            next(error)
        }
    },

    saveMenu: async (req, res, next) => {
        res.send("Menu Works")
    },

    uploadImage: async (req, res, next) => {

        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }
        // If the image was successfully uploaded, you can get the file details from req.file
        const filePath = req.file.path;
        const fileName = req.file.filename;
        const imageSize = req.file.size;

        // Perform any additional logic you need with the uploaded image here

        return res.status(200).json({
            message: 'Image uploaded successfully',
            file: {
                path: filePath,
                name: fileName,
                size: imageSize,
                url:`http://localhost:3000/profile/${fileName}`
                
            },
        });
    }


}
