const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        likedBlogs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],
        dislikedBlogs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],
    },
    { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
