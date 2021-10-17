const mongoose = require("mongoose");
const Comment = require("../models/comment");
const User = require("../models/user");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_225");
});

const BlogSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        body: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        likeCount: {
            type: Number,
            default: 0,
        },
        dislikeCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

BlogSchema.virtual("date").get(function () {
    const d = new Date();
    let z = parseInt((d.getTime() - this.updatedAt.getTime()) / 1000);
    let s = "";
    if (z >= 60 * 60 * 24 * 30 * 12) {
        z = parseInt(z / (60 * 60 * 24 * 30 * 12));
        s = " Year Ago";
    } else if (z >= 60 * 60 * 24 * 30) {
        z = parseInt(z / (60 * 60 * 24 * 30));
        s = " Month Ago";
    } else if (z >= 60 * 60 * 24) {
        z = parseInt(z / (60 * 60 * 24));
        s = " Days Ago";
    } else if (z >= 60 * 60) {
        z = parseInt(z / (60 * 60));
        s = " Hour Ago";
    } else if (z >= 60) {
        z = parseInt(z / 60);
        s = " Minutes Ago";
    } else {
        s = " Seconds Ago";
    }
    return z + s;
});

BlogSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        for (let comment of doc.comments) {
            await Comment.findByIdAndDelete(comment._id);
        }
        for (let img of doc.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
        const users = await User.find({});
        for (let user of users) {
            await user.updateOne({
                $pull: { likedBlogs: { $in: doc._id } },
            });
            await user.updateOne({
                $pull: { dislikedBlogs: { $in: doc._id } },
            });
        }
    }
});

module.exports = mongoose.model("Blog", BlogSchema);
