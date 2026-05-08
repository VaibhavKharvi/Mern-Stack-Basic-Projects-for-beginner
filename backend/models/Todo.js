const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model('Todo', TodoSchema);