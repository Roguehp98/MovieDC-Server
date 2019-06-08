const movieModel = require('./model');
const API_KEY = "b5dae82479460f3722fefef66976b8a1";
const axios = require('axios');

const createMovie = async(root, {movieID,title,poster_path,backdrop_path,overview,vote_average,release_date}) => {
    try{
        const newMovie = await movieModel.create({movieID,title,poster_path,backdrop_path,overview,vote_average,release_date});
        return newMovie;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const getAllMovie = async(root) => {
    try {
        const movies = await movieModel.find({});
        return movies;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const deleteMovie = async(root,{id}) => {
    try {
        const movieDelete = await movieModel.findOneAndDelete({movieID: id});
        return id;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const getInfoMovie = async(root,{id}) => {
    try{
        const movie = await movieModel.findOne({movieID: id});
        return movie;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const updateMovie = async(root, {id,title,poster_path,backdrop_path,overview,vote_average,release_date,keyYt}) => {
    try{
        const dataChange = {id,title,poster_path,backdrop_path,overview,vote_average,release_date,keyYt};
        const movieUpdated = 
                    await movieModel.findOne({movieID: id})
                                    .then(movieFound => {
                                        for(key in dataChange){
                                            movieFound[key] = dataChange[key];
                                        }
                                        return movieFound.save();
                                    })
        return movieUpdated;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

//get all key Youtube from API
const getAllKeyYt = async(root,{id}) => {
    try {
        const URI = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`;
        const key = [];
        // obj.key =[]
        await axios.get(URI)
            .then(response => {
                response.data.results.forEach(element => {
                    key.push(element.key)
                })
            })
        return key;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

//get info movie from api
const getMovieByID = async(root,{id}) => {
    try {
        const URI = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
        const obj = {};
        await axios.get(URI)
        .then(response => {
            const element = response.data;
            obj.id = element.id;
            obj.title = element.title;
            obj.genres = [];
            element.genres.forEach(object => obj.genres.push(object.name));
            obj.homepage = element.homepage;
            obj.imdb_id = element.imdb_id;
            obj.backdrop_path = "https://image.tmdb.org/t/p/w500" + element.backdrop_path;
            obj.poster_path = "https://image.tmdb.org/t/p/w500" + element.poster_path;
            obj.runtime = element.runtime + " minutes";
            obj.vote_average = element.vote_average;
            obj.overview = element.overview;
            obj.release_date = element.release_date;
        })
        
        return obj;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

module.exports = {
    createMovie,
    getAllMovie,
    deleteMovie,
    getInfoMovie,
    updateMovie,
    getAllKeyYt,
    getMovieByID
}