const express = require('express')
const router = express.Router()
const fs = require('fs')

const posts = require('../api/blog.json')

router.get('/all', (req, res) => { // Gets all posts
  res.json(posts)
})

router.get('/comments', (req, res) => { // Returns an array of the bodies of each post
  const comments = posts.map(post => post.body)

  res.json(comments)
})

router.get('/:id', (req, res) => { // Gets specific post by id
  const postId = parseInt(req.params.id)
  const post = posts.find(post => post.post_id === postId) // Finds the post by the id that is entered

  res.json(post)
})

router.post('/create', (req, res) => { // Creates new posts
  const ids = posts.map(post => post.post_id) // Array of all the post ids

  // Adds 1 to the last post in the array's id to create a new id
  //  Unless the array is empty, then the new id would be 1
  let newId = ids.length > 0 ? Math.max(...ids) + 1 : 1 
  
  req.body.post_id = newId
  posts.push(req.body)

  res.json({
    message: 'created new post',
    newPost: req.body
  })
})

router.put('/update/:id', (req, res) => { // Updates post
  const postId = parseInt(req.params.id)

  // Finds the index of the post in the array based on the post ID
  const postIndex = posts.findIndex(post => post.post_id === postId)

  // Updates the post at its index
  posts[postIndex] = req.body
  posts[postIndex].post_id = postId
  

  res.json({
    message: 'post updated successfully',
    updatedPost: req.body
  })
})

router.delete('/delete/:id', (req, res) => { // Deletes post
  const postId = parseInt(req.params.id)
  const postIndex = posts.findIndex(post => post.post_id === postId)

  const deletedPost = posts.splice(postIndex, 1) // .splice returns the deleted post, then stores it in the deletedPost variable

  res.json({
    message: 'deletion successful',
    postDeleted: deletedPost
  })
})

module.exports = router