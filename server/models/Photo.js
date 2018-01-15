const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
const photoSchema = new mongoose.Schema({
  owner: ObjectId,
  likeCount: Number,
  likes: Array,
  url : String,
  description: String,
}, { timestamps: true });


const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;