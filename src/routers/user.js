const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')



//signup
router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateToken()
    res.status(200).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

//login 
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    await user.generateToken()
    res.status(200).send(user)
  } catch (e) {
    res.status(404).send(e.message)
  }
})


///get profile
router.get('/profile', auth, async (req, res) => {
  res.status(200).send(req.user)

})


//logout
router.delete('/profile', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el !== req.token
    })
    await req.user.save()
    res.send('logout Success')
  }
  catch (e) {
    res.status(500).send(e)
  }

})


/////multer
const uploads = multer({
  limits: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      cb(new Error('Please upload image'))
    }
    cb(null, true)
  }
})

router.post('/profile/avatar', auth, uploads.single('avatar'), async (req, res) => {
  try {
    console.log(req.file)
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
  }
  catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router