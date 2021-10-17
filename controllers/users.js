const User = require("../models/user");
const Blog = require("../models/blog");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "WELCOME TO BLOG APP!");
            res.redirect("/blogs");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.loginUser = (req, res) => {
    req.flash("success", "WELCOME BACK!");
    const redirectUrl = req.session.returnTo || "/blogs";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash("success", "Goodbye!");
    res.redirect("/blogs");
};

module.exports.profile = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const blogs = await Blog.find({ author: userId });
    res.render("users/profile", { user, blogs });
};
