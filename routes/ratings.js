const express = require("express");
const ratings = require("../controllers/ratings");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");
const router = express.Router({ mergeParams: true });

router.post("/:userId/l", isLoggedIn, catchAsync(ratings.likes));
router.post("/:userId/d", isLoggedIn, catchAsync(ratings.dislike));

module.exports = router;
