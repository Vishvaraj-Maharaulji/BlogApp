const mongoose = require("mongoose");
const Blog = require("../models/blog");

mongoose.connect("mongodb://localhost:27017/blog-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "OH NO MONGO CONNECTION ERROR!!!!"));
db.once("open", () => {
    console.log("MONGO CONNECTION OPEN!!");
});

const titles = [
    "5 Facts That Nobody Told You About Sports.",
    "7 Important Facts That You Should Know About Sports.",
    "Five Things Your Boss Needs To Know About Sports.",
    "How To Leave Sports Without Being Noticed.",
    "15 Mind Numbing Facts About Sports.",
    "10 Things To Avoid In Sports.",
    "7 Sports Tips You Need To Learn Now.",
];

const seedDB = async () => {
    await Blog.deleteMany({});
    for (let i = 0; i < titles.length; i++) {
        const blog = new Blog({
            author: "6162fd9495301e9a177522b5",
            title: titles[i],
            body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod laudantium hic minima labore minus sint quas maiores itaque, quis ex, a sequi iste culpa vitae voluptate consectetur placeat ipsa harum!Fuga deserunt minus possimus, voluptate facere qui blanditiis labore, mollitia vel veniam praesentium, expedita officia esse! Quisquam nostrum modi veniam, suscipit tempore debitis obcaecati, est ut, magnam ex fuga deserunt! Cupiditate sed aspernatur nobis veniam iusto sint reprehenderit neque eveniet repellat, corrupti facilis quidem consequuntur, consequatur alias rem tempore dicta fugiat quia cumque quis perspiciatis velit fugit eos id. Minima!",
            images: [
                {
                    url: "https://res.cloudinary.com/dt3xzt70y/image/upload/v1633415486/BlogSite/nfz1c75rmndbdksdqilb.jpg",
                    filename: "BlogSite/nfz1c75rmndbdksdqilb",
                },
                {
                    url: "https://res.cloudinary.com/dt3xzt70y/image/upload/v1633415486/BlogSite/kasmjpluaftwzqmcr3x3.jpg",
                    filename: "BlogSite/kasmjpluaftwzqmcr3x3",
                },
                {
                    url: "https://res.cloudinary.com/dt3xzt70y/image/upload/v1633877659/BlogSite/sasf4cv2hd3ya2rqaaky.jpg",
                    filename: "BlogSite/sasf4cv2hd3ya2rqaaky",
                },
            ],
        });
        await blog.save();
    }
};

seedDB().then(() => {
    db.close();
});
