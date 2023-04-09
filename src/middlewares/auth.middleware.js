const authMiddlewares = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    res.redirect('/singIn')
};


module.exports = authMiddlewares;