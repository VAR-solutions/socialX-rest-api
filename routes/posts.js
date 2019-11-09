const express = require('express');
const router = express.Router();
const postController = require('../app/api/controllers/posts');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })

router.get('/', postController.getMyFeed);
router.post('/', upload.single('photo'), postController.create);
router.get('/all', postController.getAll);
router.get('/:username', postController.getMyPosts);
router.get('/:post_id', postController.getById);
router.post('/:post_id/comment', postController.addNewComment);
router.post('/:post_id/comment/delete', postController.deleteComment);
router.post('/:post_id/like', postController.like);
router.post('/:post_id/unlike', postController.unlike);
router.delete('/:post_id/delete', postController.deletePost);
router.put('/:post_id/update', postController.updatePost);
module.exports = router;