const express = require('express')

const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')

const router = express.Router()
const PostsController = require('../controllers/posts')

router.post('', checkAuth, extractFile, PostsController.createPost)

router.get('/:id', PostsController.getPost)

router.put('/:id', checkAuth, extractFile, PostsController.updatePost)

// router.use('/api/posts',(req, res, next) => {
router.get('', PostsController.getPosts);

router.delete('/:id', checkAuth, PostsController.deletePost)

module.exports = router
