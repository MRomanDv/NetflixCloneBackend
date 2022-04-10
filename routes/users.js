const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const veryfy = require('../verifyToken') 

//UPDATE
router.put('/:id',veryfy, async(req,res)=>{
    if(req.usuario.id === req.params.id || req.usuario.isAdmin){
        if(req.body.password){
            CryptoJS.AES.encrypt(
                req.body.password, 
                process.env.SECRET_KEY
                ).toString()
        } 
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new:true})
            res.status(200).json(updateUser)
            
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('Permission declined to update another accounts')
    }
    
})
//DELETE
router.delete('/:id',veryfy, async(req,res)=>{
    if(req.usuario.id === req.params.id || req.usuario.isAdmin){
        try {
            const deleteUser = await User.findByIdAndDelete(req.params.id)
            res.status(200).json('user has been deleted') 
            
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('Permission declined to delete another accounts')
    }
})
//GET
router.get('/find/:id', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id) 
        const {password,...info} = user._doc
        res.status(200).json(info) 
    }catch(error){
        res.status(500).json(error)
    }
})
//GET ALL USERS
router.get('/', veryfy, async(req,res)=>{
    const query = req.query.new
    if(req.usuario.isAdmin) {
        try {
            const users = query ?await User.find().sort({_id:-1}).limit(5) :await User.find()
            res.status(200).json(users) 
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('Your are not authorized to see all users')
    }
})
//GET USERS STATS
router.get('/stats',async(req,res)=>{
    const today = new Date()
    const lastYear = today.setFullYear(today.setFullYear() - 1)

    const monthsArray = ['January','February','March','April','May','June','July','August','September','October','November','December']

    try {
        const data = await User.aggregate([
            {
                $project:{
                    month:{$month: "$createdAt"}
                }
            },
            {
                $group : {
                    _id:"$month",
                    total: {$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router