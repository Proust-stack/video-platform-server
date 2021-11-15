const router = require('express').Router()
const verify = require('../verifyToken')
const List = require('../models/List')
router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const savedList = await newList.save()
            res.status(201).json(savedList)
        } catch (error) {
            res.status(403).json(error)
        }
    } else {
        res.status(403).json("you are not allowed to add list")
    }
})
router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id)
            res.status(200).json("the list has been deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you are not logined in probably, login again, please")
    }
})
router.put('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedList = await List.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            res.status(200).json(updatedList)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you are not logined in probably, login again, please")
    }
})
router.get('/', verify, async (req, res) => {
    const typeQuery = req.query.type
    const genreQuery = req.query.genre
    let list;
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $match: { type: typeQuery, genre: genreQuery } },
                    { $sample: { size: 10 } },
                  ]);
            } else {
                list = await List.aggregate([
                    { $match: { type: typeQuery} },
                    { $sample: { size: 10 } }
                ]);
            }
        } else {
            list = await List.aggregate([
                { $sample: { size: 10 } }
            ]);
        }
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json(err)
    }
})

module.exports = router 