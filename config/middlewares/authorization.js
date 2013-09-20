/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Poll authorizations routing middleware
 */
exports.poll = {
    hasAuthorization: function(req, res, next) {
        var owner = JSON.stringify(req.poll.owner._id);
        var requester = JSON.stringify(req.user._id);
        if (owner !== requester) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};
