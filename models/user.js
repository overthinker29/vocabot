// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost/vocab_bot');
// Create a schema
var UserSchema = new mongoose.Schema({
  facebookId: String,
  name: String,
  examType: Boolean,
  wordsUsed: String,
  updated_at: { type: Date, default: Date.now },
});
// Create a model based on the schema
var User = mongoose.model('User', UserSchema);
