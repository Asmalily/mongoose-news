const express = require('express')
const app = express()
const port = process.env.PORT||3000

const router = new express.Router()
const newsModel = require('../models/news')
const auth = require('../middleware/auth')

// post

router.post('/news',auth,async(req,res)=>{
  try{
     
      const news = new newsModel({...req.body,author:req.user._id})
      await news.save()
      res.status(200).send(news)
  }
  catch(e){
      res.status(400).send(e)
  }
})
/////get by id
router.get('/news/:id',auth,async(req,res)=>{
  const id = req.params.id
  try{
      const news = await newsModel.findById(id)
      if(!news){
          return res.status(404).send('No News found')
      }
      res.status(200).send(news)
  }
  catch(e){
      res.status(500).send(e.message)
  }
})

///patch
router.patch('/news/:id',auth,async(req,res)=>{
  try{
      const news = await newsModel.findByIdAndUpdate(req.params.id,req.body,{
          new:true,
          runValidators:true
      })
      if(!news){
          res.status(404).send('No News is found')
      }
      res.status(200).send(news)
  }
  catch(e){
      res.status(500).send(e.message)
  }
})

// delete

router.delete('/news/:id',auth,async(req,res)=>{
  try{
      const news = await newsModel.findByIdAndDelete(req.params.id)
      if(!news){
          res.status(404).send('No News is found')
      }
      res.status(200).send(news)
  }
  catch(e){
      res.status(500).send(e.message)
  }
})

module.exports = router
