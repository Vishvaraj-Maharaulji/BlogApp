const Blog = require("../models/blog");
const User = require("../models/user");

module.exports.likes = async (req, res) => {
    const { id, userId } = req.params;
    const blog = await Blog.findById(id);
    const user = await User.findById(userId);

    const liked = user.likedBlogs.indexOf(blog._id);
    const disliked = user.dislikedBlogs.indexOf(blog._id);

    if (liked !== -1) {
        res.send(blog);
        console.log(user);
    } else {
        if (disliked !== -1) {
            user.dislikedBlogs.splice(disliked, 1);
            blog.dislikeCount -= 1;
        }
        console.log(user);
        user.likedBlogs.push(blog._id);
        blog.likeCount += 1;
        await user.save();
        await blog.save({ timestamps: { createdAt: true, updatedAt: false } });
        // res.redirect(`/blogs/${id}`);
        res.send(blog);
    }
};

module.exports.dislike = async (req, res) => {
    const { id, userId } = req.params;
    const blog = await Blog.findById(id);
    const user = await User.findById(userId);

    const liked = user.likedBlogs.indexOf(blog._id);
    const disliked = user.dislikedBlogs.indexOf(blog._id);

    if (disliked !== -1) {
        res.send(blog);
    } else {
        if (liked !== -1) {
            user.likedBlogs.splice(liked, 1);
            blog.likeCount -= 1;
        }
        user.dislikedBlogs.push(blog._id);
        blog.dislikeCount += 1;
        await user.save();
        await blog.save({ timestamps: { createdAt: true, updatedAt: false } });
        res.send(blog);
    }
};

/*
        he has liked the blog or disliked the blog
        if(Liked)
            return
        if(disliked)
            then remove dislike
        like
        const liked=user.likedBlogs.find(blog._id);
        const disliked=user.dislikedBlogs.find(blog._id)

        if(liked){
            res.redirect()
        }
        else {
            if(disliked){
                remove.
                dislike-1
            }
            like
            s
        }

    */
