const jwt = require('jsonwebtoken');

module.exports = {
    homePage: async(req, res) => {
        req.user ? res.redirect('/dashboard') : res.render('login');
    },


    dashboard: async(req, res) => {
        res.render('dashboard',{
            loggedInUser: req.user
        });
    },

    logOut: async(req, res) => {
        req.session = null;
        res.clearCookie("adminToken");
        req.logOut();
        res.redirect('/');
    },
}