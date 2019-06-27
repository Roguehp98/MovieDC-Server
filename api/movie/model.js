const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
// ObjectId.prototype.valueOf = function () {
// 	return JSON.parse(this.toString());
// };

const commentSchema = new Schema({
    title: {type: String, require: true},
    owner: {type: ObjectId, ref: 'User'}},
    { timestamps: true}
)

const movieSchema = new Schema({
    movieID: {type: String, unique: true, require: true},
    title: {type: String, require: true},
    genres: [{type: String,require: true}],
    homepage: {type: String,require: true},
    poster_path: {type: String,require: true},
    backdrop_path: {type: String,require: true},
    overview: {type: String,require: true},
    vote_average: {type: Number,require: true},
    release_date: {type: String,require:true},
    runtime: {type: String,require: true},
    keyYt: {type: String,require:true, default: null},
    comments: [commentSchema]
})

module.exports = mongoose.model("lists",movieSchema);