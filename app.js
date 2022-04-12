if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");

/*Routes Requires */
const blogRoutes = require("./routes/blogs");
const commentRoutes = require("./routes/comments");
const replyRoutes = require("./routes/replies");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const ratingRoutes = require("./routes/ratings");

/*Authentication */
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStartery = require("passport-local");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/blog-app";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "OH NO MONGO CONNECTION ERROR!!!!"));
db.once("open", () => {
    console.log("MONGO CONNECTION OPEN!!");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
//for serving static images to each one routes and directly access the files not give whole path

app.use(
    mongoSanitize({
        replaceWith: "_",
    })
);

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

/*Setting mongo store */
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

/*Session Setup */
const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());
/*Session Setup Finish */

/*Helmet Setup*/
app.use(helmet()); //this awakes all 11 middleware

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
    "https://code.jquery.com/jquery-3.6.0.min.js",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [];

const fontSrcUrls = ["https://fonts.gstatic.com"];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dt3xzt70y/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
                "https://media.istockphoto.com/photos/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
/*Helmet setup finish */

/*Passport Setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartery(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!["/login", "/", "logout"].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
});
/*Passport Setup Finish */

/*Including /blogs */
app.use("/", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/user/", ratingRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/blogs/:id/comments/:commentId/reply", replyRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No Something Went Wrong";
    res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`);
});
