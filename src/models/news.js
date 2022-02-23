const mongoose = require('mongoose')


const newsSchema = mongoose.model('News', mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User'
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  }
},
  { timestamps: {currentTime: () => Math.floor(Date.now() / 1000)} }));


module.exports = newsSchema