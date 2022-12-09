const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { Module } = require("module");
const Schema = mongoose.Schema;
const finalUsers = new Schema({
    "email": {
        "type": String,
        "unique": true
    },
    "password": String,
});


let User

module.exports.startDB = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://rbirla:bti325@cluster0.n5xnrkc.mongodb.net/?retryWrites=true&w=majority");

        db.on('error', (err) => {
            console.log("Cannot connect to DB.")
            reject(err);
        });
        db.once('open', () => {
            User = db.model("finalUsers", finalUsers);
            console.log("DB connection successful.")
            resolve();
        });
    });
};

module.exports.register = function (user) {
    return new Promise(function (resolve, reject) {
        if (user.email == '' || user.password == '') {
            reject('“Error: email or password cannot be empty.”')
        }
        bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(user.password, salt))
            .then(hash => {
                user.password = hash
                let newUser = new User(user);

                newUser.save().then(() => {
                    resolve(user)
                }).catch(err => {
                    if (err.code == 11000) {
                        reject("Error: (user’s email) already exists")
                    } else {
                        reject('Error: cannot create the user')
                    }
                })
            })
            .catch(err => {
                return reject(err)
            });
    })
}


module.exports.signIn = function (user) {
    return new Promise(function (resolve, reject) {
        User.find({ email: user.email }).then(users => {
            if (users.length < 0) {
                return reject(`Unable to find user: ${user.email}`)
            }
            bcrypt.compare(user.password, users[0].password).then((result) => {
                if (result) {
                    resolve(user)
                } else {
                    return reject(` “Incorrect password for user ${user.email}” `)
                }

            });

        }).catch(err => reject(`Cannot find the user: ${user.email} `))
    });
}
