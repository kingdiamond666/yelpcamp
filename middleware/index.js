var Campground = require('../models/campground')
var Comment = require('../models/comment')

var middleware = {};

middleware.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', "You need to be logged in to do that!")
    res.redirect('/login');
}

middleware.checkCommentOwnership = function (req, res, next){
        if(req.isAuthenticated()){
         
            Comment.findById(req.params.comment_id, function(err, foundComment){
                //does user own the campground? 
                if(err){
                    res.redirect('back');
                } else {
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash('error', 'You don\'t have permission to do that!')
                        res.redirect('back')
                    }
                }
            });
        } else {
            req.flash('error', 'You need to be logged in to do that!')
            res.redirect("back");
    }
}

middleware.checkCampgroundOwnership = function (req, res, next){
        if(req.isAuthenticated()){
         
            Campground.findById(req.params.id, function(err, foundCampground){
                //does user own the campground? 
                if(err){
                    req.flash('error', 'Campground not found');
                    res.redirect('back');
                } else {
                    if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                    
                    }
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash('error', 'You don\'t have permission to do that');
                        res.redirect('back')
                    }
                }
            });
        } else {
            req.flash('error', 'You need to be logged in to do that!')
            res.redirect("back");
    }
}

module.exports = middleware;