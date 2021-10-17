const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reply = require("../models/reply");

const CommentSchema = new Schema(
    {
        text: String,
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Reply",
            },
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

CommentSchema.virtual("date").get(function () {
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

CommentSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Reply.deleteMany({ _id: { $in: doc.replies } });
    }
});

module.exports = mongoose.model("Comment", CommentSchema);
