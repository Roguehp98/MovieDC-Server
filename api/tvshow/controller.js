const API_KEY = "b5dae82479460f3722fefef66976b8a1";
const axios = require('axios');
const tvModel = require('./model');

const createTvshow = async(root, {idTv,title,poster_path,keyYt}) => {
    try{
        const newTvshow = await tvModel.create({idTv,title,poster_path,keyYt});
        return newTvshow;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const getAllTvshow = async(root) => {
    try {
        const tvshow = await tvModel.find({});
        return tvshow;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const deleteTvshow = async(root,{id}) => {
    try{
        const tvshowDeleted = await tvModel.findOneAndDelete({idTv: id});
        return id;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const updateTvshow = async(root,{id,title,poster_path,keyYt}) => {
    try {
        const updatedTvshow = await tvModel.findOneAndUpdate({idTv: id},{id,title,poster_path,keyYt});
        return updatedTvshow;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const getTvshowByAPI = async(root,{id}) => {
    try {
        const URI = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`;
        const obj = {};
        await axios.get(URI)
                .then(response => {
                    // resolve(response.data)
                    const element = response.data;
                    obj.idTv = element.id;
                    obj.name = element.name;
                    obj.poster_path = "https://image.tmdb.org/t/p/w500" + element.poster_path;
                    obj.backdrop_path = "https://image.tmdb.org/t/p/w500" + element.backdrop_path;
                    obj.first_air_date = element.first_air_date;
                    obj.genres = [];
                    element.genres.forEach(object => obj.genres.push(object.name));
                    obj.episode_run_time = element.episode_run_time[0];
                    obj.number_of_seasons = element.number_of_seasons;
                    obj.homepage = element.homepage;
                    obj.overview = element.overview;
                    obj.producer = [];
                    element.created_by.forEach(object => obj.producer.push(object.name));
                })
        return obj;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

module.exports = {
    createTvshow,
    getAllTvshow,
    deleteTvshow,
    updateTvshow,
    getTvshowByAPI
}