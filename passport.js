const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // to use username and password for authentication
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
},
    function (jwtPayload, cb) {
        console.log('jwtPayload:', jwtPayload)
        return User.findById(jwtPayload._id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));