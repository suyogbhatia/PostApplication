const Post = require('../models/post')
exports.createPost = async (req, res, next) => {
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
  try {
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
  } catch (err) {
    res.status(401).json({ message: "Creating Post Failed!" })
  }
}

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not Found!' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Fetching post failed!' })
  }
}

exports.updatePost =  async (req, res, next) => {
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
  try {
    updateStatus = await Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    console.log(post, updateStatus);
    if (updateStatus.n >= 1) {
      res.status(200).json({ message: 'Update Successfull' })
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } catch (err) {
    res.status(500).json({ message: "Couldn't update post!" })
  }
}

exports.getPosts = async (req, res, next) => {
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
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Fetching posts failed!' })
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    deleteStatus = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    console.log(deleteStatus);
    if (deleteStatus.deletedCount >= 1) {
      res.status(200).json({ message: 'Post deleted!' })
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Fetching post failed' })
  }
}
