const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieID: {type: String, unique: true, require: true},
    title: {type: String, require: true},
    poster_path: {type: String,require: true},
    backdrop_path: {type: String,require: true},
    overview: {type: String,require: true},
    vote_average: {type: Number,require: true},
    release_date: {type: String,require:true},
    keyYt: {type: String,require:true, default: null}
})

module.exports = mongoose.model("lists",movieSchema);