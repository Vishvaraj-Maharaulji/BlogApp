const { blogSchema, commentSchema, replySchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Blog = require("./models/blog");
const Comment = require("./models/comment");
const Reply = require("./models/reply");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You Must Be Logged In First!");
        res.redirect("/login");
    } else {
        next();
    }
};

module.exports.validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog.author.equals(req.user._id)) {
        req.flash("error", "You Dont Have Permission to do that!");
        return res.redirect(`/blogs/${id}`);
    }
    next();
};

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash("error", "You Dont Have Permission to do that!");
        return res.redirect(`/blogs/${id}`);
    }
    next();
};

module.exports.validateReply = (req, res, next) => {
    const { error } = replySchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isReplyAuthor = async (req, res, next) => {
    const { id, replyId } = req.params;
    const reply = await Reply.findById(replyId);
    if (!reply.author.equals(req.user._id)) {
        req.flash("error", "You Dont Have Permission to do that!");
        return res.redirect(`/blogs/${id}`);
    }
    next();
};
