const movieModel = require('./model');
const API_KEY = "b5dae82479460f3722fefef66976b8a1";
const axios = require('axios');

const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENT = 'REMOVE_COMMENT';

const createMovie = async(root, {movieID,title,genres,homepage,poster_path,backdrop_path,overview,vote_average,release_date,runtime,keyYt}) => {
    try{
        const newMovie = await movieModel.create({movieID,title,genres,homepage,poster_path,backdrop_path,overview,vote_average,release_date,runtime,keyYt});
        return newMovie;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const getAllMovie = async(root) => {
    try {
        const movies = await movieModel.find({}).populate('owner').exec();
        // console.log(movies)
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
        const movie = await movieModel.findOne({movieID: id}).populate('comments.owner')
        return movie;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

const updateMovie = async(root, {id,title,genres,homepage,poster_path,backdrop_path,overview,vote_average,release_date,runtime,keyYt}) => {
    try{
        const dataChange = {id,title,genres,homepage,poster_path,backdrop_path,overview,vote_average,release_date,runtime,keyYt};
        const movieUpdated = 
                    await movieModel.findOne({movieID: id}).populate('comments.owner','-password')
                                    .then(movieFound => {
                                        for(key in dataChange){
                                            if(dataChange[key] !== undefined)
                                                movieFound[key] = dataChange[key];
                                        }
                                        return movieFound.save();
                                    })
                                        // console.log(movieUpdated)
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

//add comment user for movie
const addComment = async(root, {idMovie,idUser,contentCmt}, {pubsub}) => {
    try {
        const title = contentCmt;
        const owner = idUser;
        const movieUpdated = await movieModel
                                .findOneAndUpdate({movieID: idMovie}
                                    ,{$push:{comments: {
                                        $each: [{title,owner}],
                                        $position: 0
                                    }
                                }}, {new : true})
                                .populate('comments.owner','-password')
        pubsub.publish(ADD_COMMENT, {addedComment: {
           comments: [{
            title: contentCmt,
            owner: {
                id: idUser,
                username: movieUpdated.comments[movieUpdated.comments.length - 1].owner.username
            },
            createdAt: movieUpdated.comments[movieUpdated.comments.length - 1].createdAt
            }]
        }})
        return movieUpdated;
    }catch(err) {
        console.log(err);
        throw new Error(err.message);
    }
}

//remove comment
const deleteComment = async(root, {idMovie,idUser,time},{pubsub}) => {
    try {
        const timeConvert = new Date(time);
        const movieUpdated = await movieModel.findOne({movieID: idMovie}).populate('comments.owner','-password')
            .then(userFound => {
                userFound.comments.map((comment,index) => {
                    if(comment.owner._id.toString() === idUser && comment.createdAt.getTime()===timeConvert.getTime()){
                        userFound.comments.splice(index,1);
                    }
                })
                return userFound.save();
            })
        pubsub.publish(REMOVE_COMMENT,{removedComment: {
            comments: [{
                owner: {
                    id: idUser
                },
                createdAt: time
            }]
        }})
        return movieUpdated;
    }catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    createMovie,
    getAllMovie,
    deleteMovie,
    getInfoMovie,
    updateMovie,
    getAllKeyYt,
    getMovieByID,
    addComment,
    deleteComment
}