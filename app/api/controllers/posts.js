const postModel = require('../models/posts');
module.exports = {
    getById: function (req, res, next) {
        console.log(req.body);
        postModel.findById(req.params.post_id, function (err, postInfo) {
            if (err) {
                next(err);
            } else {
                res.json({ status: "success", message: "Post found!!!", data: { Post: postInfo } });
            }
        });
    },
    getAll: function (req, res, next) {
        let postsList = [];
        postModel.find({}, function (err, posts) {
            if (err) {
                next(err);
            } else {
                for (let post of posts) {
                    postsList.push({ id: post._id, username: post.username, content: post.content, posted_on: post.posted_on });
                }
                res.json({ status: "success", message: "Posts list found!!!", data: { posts: postsList } });

            }
        });
    },
    create: function (req, res, next) {
        postModel.create({ username: req.body.username, content: req.body.content, posted_on: req.body.posted_on }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({ status: "success", message: "Post added successfully!!!", data: null });

        });
    },
    deletePost: function (req, res, next) {
        postModel.findByIdAndRemove(req.body.post_id, function (err, r) {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            } else {
                return res.json({
                    message: "deleted the post successfully"
                })
            }
        })
    },
    updatePost: function (req, res, next) {
        postModel.findByIdAndUpdate(req.body.post_id, { $set: { content: req.body.content } }, { new: true }, function (err, r) {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(r);
                console.log(req.body.content)
            }
        })
    },
    addNewComment: function (req, res, next) {
        // console.log(req.body)
        let comment = {}
        comment.postedBy = req.body.userId;
        comment.content = req.body.content;
        console.log(comment)
        postModel.findByIdAndUpdate(req.body.post_id, { $push: { comments: comment } }, { new: true }, function (err, post) {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(post);
            }
        })

    },
    like: function (req, res, next) {
        let n = []
        postModel.findById(req.body.post_id, (err, r) => {
            n = Array.from(r.likes)
            n.push(req.body.userId)
            let s = new Set(n)
            n = Array.from(s)
            postModel.findByIdAndUpdate(req.body.post_id, { $set: { likes: n } }, function (e, p) {
                if (e) {
                    return res.status(400).json({
                        error: e
                    });
                } else {
                    res.json({
                        likes: n
                    });
                }
            })
        });
    },
    unlike: function (req, res, next) {
        let n = []
        postModel.findById(req.body.post_id, (err, r) => {
            n = Array.from(r.likes)
            n = n.filter(function (e) {
                return e != req.body.userId
            })
            postModel.findByIdAndUpdate(req.body.post_id, { $set: { likes: n } }, function (e, p) {
                if (e) {
                    return res.status(400).json({
                        error: e
                    });
                } else {
                    res.json({
                        likes: n
                    });
                }
            })
        })
    }
}