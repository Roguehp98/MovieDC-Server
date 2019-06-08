const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tvSchema = new Schema({
    idTv: {type: String, require: true,unique:true},
    title: {type: String, require: true},
    poster_path: {type: String,require: true},
    keyYt: {type: String,require:true, default: null}
})

module.exports = mongoose.model("TvShow", tvSchema);