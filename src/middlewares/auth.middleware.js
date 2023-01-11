const authMiddlewares = (req, res, next) => {
    if (!req.session.username) {
        return res.status(401).send('No estas autorizado');
    }
    next();
};


module.exports = authMiddlewares;