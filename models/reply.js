const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema(
    {
        text: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

ReplySchema.virtual("date").get(function () {
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

module.exports = mongoose.model("Reply", ReplySchema);
