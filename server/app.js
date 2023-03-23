require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/connect');

const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const registerRoutes = require('./Routes/register');
const jobsRoutes = require('./Routes/jobs');
const notFound = require('./errors/notFound');

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);


app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());


app.use(cookieParser());
app.use(xss())
app.use(cors({ credentials: true, origin: process.env.frontend_domain }))
app.use(helmet())

app.use('/api', registerRoutes);
app.use('/api', jobsRoutes);
app.use(notFound);

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('DB is connected')
        console.log(`App is listening at port ${PORT}...`)
    }
    catch (err){
        console.log(err)
    }

})
