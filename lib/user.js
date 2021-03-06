//user
//external modules
var mongoose = require('mongoose');

//core
var config = require("../config.js");
var logger = require("./logger.js");

// create a user model
var model = mongoose.model('user', {
    id: String,
    profile: String,
    history: String,
    created: Date
});

//public
var user = {
    model: model,
    findUser: findUser,
    newUser: newUser,
    findOrNewUser: findOrNewUser,
    getUserCount: getUserCount
};

function getUserCount(callback) {
    model.count(function(err, count){
        if(err) callback(err, null);
        else callback(null, count);
    });
}

function findUser(id, callback) {
    model.findOne({
        id: id
    }, function (err, user) {
        if (err) {
            logger.error('find user failed: ' + err);
            callback(err, null);
        }
        if (!err && user) {
            callback(null, user);
        } else {
            logger.error('find user failed: ' + err);
            callback(err, null);
        };
    });
}

function newUser(id, profile, callback) {
    var user = new model({
        id: id,
        profile: JSON.stringify(profile),
        created: Date.now()
    });
    user.save(function (err) {
        if (err) {
            logger.error('new user failed: ' + err);
            callback(err, null);
        } else {
            logger.info("new user success: " + user.id);
            callback(null, user);
        };
    });
}

function findOrNewUser(id, profile, callback) {
    findUser(id, function(err, user) {
        if(err || !user) {
            newUser(id, profile, function(err, user) {
                if(err) {
                    logger.error('find or new user failed: ' + err);
                    callback(err, null);
                } else {
                    callback(null, user);
                }
            });
        } else {
            callback(null, user);
        }
    });
}

module.exports = user;