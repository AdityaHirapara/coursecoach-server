const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
});

module.exports = mongoose.model('Course', CourseSchema);
