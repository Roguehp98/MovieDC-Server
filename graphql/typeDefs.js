const typeDefs = `
    type ListFv {
        id: ID!,
        name: String!,
        type: String!,
    }
    type User {
        id: ID!,
        username: String!, 
        name: String!,
        password: String!,
        age: Int!,
        gender: String!,
        listfv: [ListFv!]
    }
    type Movie {
        movieID: String!,
        title: String!,
        poster_path: String!,
        backdrop_path: String!,
        overview: String!,
        vote_average: String!,
        release_date: String!,
        keyYt: String!,
    }
    type MovieAPI {
        id: String!,
        title: String!,
        genres: [String!],
        homepage: String!,
        imdb_id: String!,
        backdrop_path: String!,
        poster_path: String!,
        runtime: String!,
        vote_average: String!,
        overview: String!,
        release_date: String!
    }
    type Tvshow {
        idTv: String!,
        title: String!,
        poster_path: String!,
        keyYt: String!
    }

    type TvshowAPI {
        idTv: String!,
        name: String!,
        poster_path: String!,
        backdrop_path: String!,
        first_air_date: String!,
        genres: [String],
        episode_run_time: String!,
        number_of_seasons: Int!,
        homepage: String!,
        overview: String!,
        producer: [String!]
    }
    type Query {
        users: [User],
        user(idUser: String!): User,
        
        isLogin: Boolean!,
        
        getAllMovie: [Movie],
        getInfoMovie(id: String!): Movie,
        getAllKeyYt(id: String!): [String],
        getMovieByID(id: String!): MovieAPI,
        
        getAllTvshow: [Tvshow],
        getTvshowByAPI(id: String): TvshowAPI
        secured: String!
    }
    type Mutation {
        createUser(
            username: String!, 
            name: String!,
            password: String!,
            gender: String!,
            age: Int!
        ): User
        updateUser(
            idUser: ID!,
            name: String,
            password: String,
            gender: String,
            age: Int
        ): User
        deleteUser(
            id: ID!,
        ): String,
        
        createMovie(
            movieID: String!,
            title: String!,
            poster_path: String!,
            backdrop_path: String!,
            overview: String!,
            vote_average: String!,
            release_date: String!,
            keyYt: String!,
        ): Movie,
        deleteMovie(
            id: String!,
        ): String,
        updateMovie(
            id: String!,
            title: String!,
            poster_path: String,
            backdrop_path: String,
            overview: String,
            vote_average: String,
            release_date: String,
            keyYt: String,
        ): Movie,
        
        createTvshow(
            idTv: String!,
            title: String!,
            poster_path: String!,
            keyYt: String!
        ): Tvshow,
        deleteTvshow(id: String!): String,
        updateTvshow(id:String!,title: String!,poster_path: String!,keyYt: String!): Tvshow

        addListFv(
            idUser: String!,
            idMovie: String!,
            nameMovie: String!,
            typeMovie: String!
        ): User
        removeListfv(idUser: String!,idMovie: String!): User,

        login(username: String!, pwd: String!): User!,
        logout: String!,
        signup(username: String!, pwd: String!): Boolean!
    }
    type Subscription {
        addListFavor: User,
        removeListFavor: User,
        createdUser: User
    }
` 

module.exports = typeDefs;