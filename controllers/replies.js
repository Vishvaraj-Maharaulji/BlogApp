const Reply = require("../models/reply");
const Comment = require("../models/comment");

module.exports.createReply = async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    const reply = new Reply(req.body.reply);
    reply.author = req.user._id;
    comment.replies.push(reply);
    await comment.save({ timestamps: { createdAt: true, updatedAt: false } });
    await reply.save();
    req.flash("success", "Successfully created new reply!");
    res.redirect(`/blogs/${id}`);
};

module.exports.deleteReply = async (req, res) => {
    const { id, commentId, replyId } = req.params;
    await Comment.findByIdAndUpdate(commentId, { $pull: { replies: replyId } });
    await Reply.findByIdAndDelete(replyId);
    req.flash("success", "Successfully deleted reply!");
    res.redirect(`/blogs/${id}`);
};
