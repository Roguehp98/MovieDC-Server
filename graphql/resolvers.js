const userController = require('../api/user/controller');
const authController = require('../api/auth/controller');
const movieController = require('../api/movie/controller');
const tvshowController = require('../api/tvshow/controller');
const listfvController = require('../api/listFavor/controller');
const {PubSub} = require('graphql-yoga');

const ADD_LISTFV = 'ADD_LISTFV';
const REMOVE_LISTFV = 'REMOVE_LISTFV';
const CREATE_USER = 'CREATE_USER';
const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENT = 'REMOVE_COMMENT';

// const pubsub = new PubSub();
 
const resolvers = {
    Query: {
        secured: async() => 
            `Personal diary - this is for my eyes only!`,
        //user
        users: userController.users,
        user: userController.user,
        //movie
        getAllMovie: movieController.getAllMovie,
        getInfoMovie: movieController.getInfoMovie,
        getAllKeyYt: movieController.getAllKeyYt,
        getMovieByID: movieController.getMovieByID,
       
        //tvshow
        getAllTvshow: tvshowController.getAllTvshow,
        getTvshowByAPI: tvshowController.getTvshowByAPI,
        isLogin: (parent, args, { req }) => {
            
            // if(req.session.user) return true;
            // else
            // req.session.destroy();
            // console.log(req.session.user)
             return false;
        },
        //auth
    },
    Mutation: {
        //user
        createUser: userController.createUser,
        updateUser: userController.updateUser,
        deleteUser: userController.deleteUser,
        //movie
        createMovie: movieController.createMovie,
        deleteMovie: movieController.deleteMovie,
        updateMovie: movieController.updateMovie,
        addComment: movieController.addComment,
        deleteComment: movieController.deleteComment,
        //tvshow
        createTvshow: tvshowController.createTvshow,
        deleteTvshow: tvshowController.deleteTvshow,
        updateTvshow: tvshowController.updateTvshow,
        //listFv
        addListFv: listfvController.addListFv,
        removeListfv: listfvController.removeListfv,
        //auth
        login: authController.login,
        logout: authController.logout
    },
    Subscription: {
        addListFavor: {
            subscribe: (parent,args,{pubsub}) => pubsub.asyncIterator(ADD_LISTFV)
        },
        removeListFavor: {
            subscribe: (parent,args,{pubsub}) => pubsub.asyncIterator(REMOVE_LISTFV)
        },
        createdUser: {
            subscribe: (parent,args,{pubsub}) => pubsub.asyncIterator(CREATE_USER)
        },
        addedComment: {
            subscribe: (parent,args,{pubsub}) => pubsub.asyncIterator(ADD_COMMENT)
        },
        removedComment: {
            subscribe: (parent,args,{pubsub}) => pubsub.asyncIterator(REMOVE_COMMENT)
        }
    }
}



module.exports = resolvers;