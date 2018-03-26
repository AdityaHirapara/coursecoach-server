const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
