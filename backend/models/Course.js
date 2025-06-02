const mongoose = require('mongoose');

const CourseDetailSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  href: { type: String }, // optional, only for leaf nodes
  restricted: { type: Boolean, default: false }, // optional, default is false
  children: [this], // recursive definition for nested children
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: [CourseDetailSchema],
  certificateTemplate: { type: String, required: true }
});

module.exports = mongoose.model('Course', CourseSchema);