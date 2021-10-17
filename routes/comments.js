const express = require("express");
const catchAsync = require("../utils/catchAsync");
const comments = require("../controllers/comments");
const { validateComment, isLoggedIn, isCommentAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateComment, catchAsync(comments.createComment));

router.delete("/:commentId", isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;
