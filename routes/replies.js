const express = require("express");
const catchAsync = require("../utils/catchAsync");
const replies = require("../controllers/replies");
const { isLoggedIn, validateReply, isReplyAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReply, catchAsync(replies.createReply));

router.delete("/:replyId", isLoggedIn, isReplyAuthor, catchAsync(replies.deleteReply));

module.exports = router;
