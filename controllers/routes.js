const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../api/blog.json') // concatenates paths to form single path
// __dirname -> (Node.js variable) represents directory name 

function readFile() {
  const rawData = fs.readFileSync(filePath) // Reads the file synchronously
  return JSON.parse(rawData) // Parses the raw data and converts it into a JS object
}

function writeFile(data) { // Writes data directly to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2)) // .stringify(data, null, 2) converts the data into a string with two spaces of indentation 
}

router.get('/all', (req, res) => { // Gets all posts
  const posts = readFile()
  res.json(posts)
})

router.get('/comments', (req, res) => { // Returns an array of the bodies of each post
  const posts = readFile()
  const comments = posts.map(post => post.body)
  res.json(comments)
})

router.get('/:id', (req, res) => { // Gets specific post by id
  const posts = readFile()
  const postId = parseInt(req.params.id)
  const post = posts.find(post => post.post_id === postId) // Finds the post by the id that is entered

  res.json(post)
})

router.post('/create', (req, res) => { // Creates new posts
  const posts = readFile()
  const ids = posts.map(post => post.post_id) // Array of all the post ids

  // Adds 1 to the last post in the array's id to create a new id
  //  Unless the array is empty, then the new id would be 1
  let newId = ids.length > 0 ? Math.max(...ids) + 1 : 1 
  
  req.body.post_id = newId
  posts.push(req.body)

  writeFile(posts)
  res.json({
    message: 'Created new post',
    newPost: req.body
  })
})

router.put('/update/:id', (req, res) => { // Updates post
  const postId = parseInt(req.params.id)
  const posts = readFile()
  // Finds the index of the post in the array based on the post ID
  const postIndex = posts.findIndex(post => post.post_id === postId)

  // Updates the post at its index
  posts[postIndex] = req.body
  posts[postIndex].post_id = postId
  
  writeFile(posts)
  res.json({
    message: 'Post updated successfully',
    updatedPost: req.body
  })
})

router.delete('/delete/:id', (req, res) => { // Deletes post
  const postId = parseInt(req.params.id)
  const posts = readFile()
  const postIndex = posts.findIndex(post => post.post_id === postId)

  const deletedPost = posts.splice(postIndex, 1) // .splice returns the deleted post, then stores it in the deletedPost variable

  writeFile(posts)
  res.json({
    message: 'Deletion successful',
    postDeleted: deletedPost
  })
})

module.exports = router