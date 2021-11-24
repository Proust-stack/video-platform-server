const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const movieRoute = require("./routes/movies")
const listRoute = require("./routes/lists")

const app = express()
app.use(cors());
app.use(express.json())

app.use(express.static('public'));
app.use('/api/auth', authRoute)
//app.use('/api/users', userRoute)
app.use("/api/movies", movieRoute)
app.use("/api/lists", listRoute)
const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        app.listen(PORT, () => console.log(`server is up on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }

}
start()