const Blog = require("../models/blog");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    blog.comments.push(comment);
    await blog.save({ timestamps: { createdAt: true, updatedAt: false } });
    await comment.save();
    req.flash("success", "Successfully created new comment!");
    res.redirect(`/blogs/${blog._id}`);
};

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted comment!");
    res.redirect(`/blogs/${id}`);
};
