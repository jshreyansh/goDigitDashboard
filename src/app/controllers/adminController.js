const jwt = require('jsonwebtoken');

module.exports = {
    homePage: async(req, res) => {
        req.user ? res.redirect('/dashboard') : res.render('login');
    },

    googleCallBack: async(req, res) => {
        const email = req.user._json.email
        jwt.sign({ email: email }, process.env.JWT_PRIVATE_KEY_HOST, (err, token) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.cookie("adminToken", token).redirect('/dashboard');
            }
        })
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