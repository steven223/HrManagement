const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const http = require('http');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

// socket
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
initSocket(server);


const corsOpts = {
  credentials: true,
  origin: 'http://localhost:4200',
};

app.use(cors(corsOpts));
if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitization ---- 
//console.log("hello deepesh")
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

app.options('*', cors({
}));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Requested Url Not found'));
});

app.response.sendResponse = function (data, message, statusCode) {
    statusCode = statusCode ? statusCode : 200
    return this.status(statusCode).send({
        // success: true,
        status: statusCode,
        message: message,
        data: data,
    })
};
const responseEnv = ["development", "test", "production"]



// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = server;//app;
