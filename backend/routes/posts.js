const express = require('express')
const multer = require('multer')

const Post = require('../models/post')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error("Invalid mime type")
    if (isValid) {
      error = null
    }
    cb(error, "backend/images") //this path is relative to the server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().replace(' ', '-');
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post('',
  checkAuth,
  multer({ storage: storage }).single("image"), async (req, res, next) => {
    // const post = req.body
    // console.log(post);
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    })
    console.log(post);
    savedPost = await post.save();  //this will insert a new data automatically to a collection named 'posts'(plural form of Post model and all small)
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        title: savedPost.title,
        content: savedPost.content,
        imagePath: savedPost.imagePath,
        id: savedPost._id,
        creator: savedPost.creator
      }
    })
  })

router.get('/:id',
  async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not Found!' })
    }
  })

router.put('/:id',
  checkAuth,
  multer({ storage: storage }).single("image"), async (req, res, next) => {
    let imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host')
      imagePath = url + '/images/' + req.file.filename
    } else {
      imagePath = req.body.imagePath
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.creator
    })
    updateStatus = await Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    console.log(post, updateStatus);
    if (updateStatus.nModified >= 1) {
      res.status(200).json({ message: 'Update Successfull' })
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  })

// router.use('/api/posts',(req, res, next) => {
router.get('', async (req, res, next) => {
  const postQuery = Post.find()
  const currentPage = +req.query.page
  const pageSize = +req.query.pagesize
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  console.log(req.query)
  const documents = await postQuery
  const count = await Post.count();
  // const posts = [
  //   {
  //     id: 'sdadd',
  //     title: 'First post',
  //     content: 'This is coming from the server'
  //   },
  //   {
  //     id: 'sddafafdd',
  //     title: 'Second post',
  //     content: 'This is coming from the server!'
  //   }
  // ];
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: documents,
    maxCount: count
  })
});

router.delete('/:id', checkAuth, async (req, res, next) => {
  deleteStatus = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  console.log(deleteStatus);
  if (deleteStatus.deletedCount >= 1) {
    res.status(200).json({ message: 'Post deleted!' })
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

module.exports = router
