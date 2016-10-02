// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost/vocab_bot');
// Create a schema
var WordsSchema = new mongoose.Schema({
  wordId: String,
  key: String,
  definition: String,
  synonyms: Array,
  antonyms: Array,
  usage: String,
  updated_at: { type: Date, default: Date.now },
});
// Create a model based on the schema
var Words = mongoose.model('Words', WordsSchema);
