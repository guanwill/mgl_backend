const passport = require('passport');
const config = require('./config');
const LocalStrategy = require('passport-local').Strategy; // to use username and password for authentication
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/User');

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.passport_secret,
    passReqToCallback: true,
},
    function (req, jwtPayload, cb) {
        console.log('jwtPayload:', jwtPayload)
        return User.findById(jwtPayload._id)
            .then(user => {
                req.user = user;
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));