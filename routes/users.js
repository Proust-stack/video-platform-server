const User = require('../models/User')
const router = require('express').Router()
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
const verify = require('../verifyToken')

router.put('/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
              ).toString()
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            const {password, ...info} = updatedUser._doc
            res.status(200).json(info)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you are not logined in probably, login again, please")
    }
})
router.delete('/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("user has been deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you are not logined in probably, login again, please")
    }
})
router.get('/find/:id',  async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            const {password, ...info} = user._doc
            res.status(200).json(info)
        } catch (error) {
            res.status(500).json(error)
        }
})
router.get('/', verify, async (req, res) => {
    const query = req.query.new
    if (req.user.isAdmin) {
        try {
            const users = query ? await User.find().sort({ _id: - 1 }).limit(5) : await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you are not allowed")
    }
})
router.get('/stats', verify, async (req, res) => {
    const today = new Date()
    const LastYear = today.setFullYear(today.getFullYear() - 1)
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: {$month: "$createdAt"}
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router 