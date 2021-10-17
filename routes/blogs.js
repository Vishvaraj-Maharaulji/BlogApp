const express = require("express");
const blogs = require("../controllers/blogs");
const { validateBlog, isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const router = express.Router();
const upload = multer({ storage });

router
    .route("/")
    .get(catchAsync(blogs.index))
    .post(isLoggedIn, upload.array("image"), validateBlog, catchAsync(blogs.createBlog));

router.get("/new", isLoggedIn, blogs.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(blogs.showBlog))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateBlog, catchAsync(blogs.updateBlog))
    .delete(isLoggedIn, isAuthor, catchAsync(blogs.deleteBlog));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(blogs.renderEditForm));

module.exports = router;
