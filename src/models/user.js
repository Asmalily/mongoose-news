const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  age: {
    type: Number,
    default: 18,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be postive number')
      }
    }
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      let reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
      if (!reg.test(value)) {
        throw new Error('Password must include uppercase, lowercase,special characer & number')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('invaled Email')
      }
    }
  },
  phone: {
    type: Number,
    required: true,
    maxlength: 11,
    minlength: 11,
    validate(value) {
      if (!validator.isMobilePhone(value.toString(), 'ar-EG')) {
        throw new Error('invaled phone number')
      }
    }
  },
  address: {
    type: String,
    required: true
  },
  tokens: [
    {
      type: String,
      required: true
    },

  ],
  avatar: {
    type: Buffer
  }
})


//password
userSchema.pre('save', async function () {
  const user = this
  if (user.isModified('password')) { user.password = await bcrypt.hash(user.password, 8) }
})


//login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable To Login')
  }
  const isMatch = bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable To Login')
  }
  return user
}
///token

userSchema.methods.generateToken = async function () {
  const user = this
  //secret word :newsapp
  const token = jwt.sign({ _id: user._id.toString() }, 'newsapp')
  user.tokens = user.tokens.concat(token)
  await user.save()
  return token
}
const User = mongoose.model('User', userSchema)
module.exports = User

