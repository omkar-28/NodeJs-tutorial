const mongoose = require('mongoose');
const dotEnv = require('dotenv');

const fs = require('fs');
const Movie = require('./../Models/movieModel');

dotEnv.config({ path: './config.env' });

mongoose.connect(process.env.DB_URI)
    .then((conn) => {
        console.log("DB connection established")
    }).catch((error) => {
        console.error("DB connection error:", error.message)
    });

const movies = JSON.parse(fs.readFileSync('./Data/movies.json', 'utf8'));

//Delete all the movie documents from the database
const deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('Data deleted successfully')
    } catch (error) {
        console.log(error.message)
    }

    process.exit();
}

// Import the movies to the MongoDB database
const importMovies = async () => {
    try {
        await Movie.create(movies);
        console.log('Data imported successfully')
    } catch (error) {
        console.log(error.message)
    }

    process.exit();
}

if (process.argv[2] === '--import') {
    importMovies();
}
if (process.argv[2] === '--delete') {
    deleteMovies();
}