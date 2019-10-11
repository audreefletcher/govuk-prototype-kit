// Core dependencies
const fs = require('fs')
const path = require('path')

// NPM dependencies
const express = require('express')
const marked = require('marked')
const matter = require('gray-matter');
const router = express.Router()

// Local dependencies
const utils = require('../lib/utils.js')

// Page routes
const userNeeds = require('./data/user-needs.json')

// Add your routes here - above the module.exports line


router.get('/needs', function (req, res) {
  res.render('needs', userNeeds);
})


router.get('/services', function (req, res) {

  // Look through a folder, get all of the files, store it as the files variable
  fs.readdir(path.join(__dirname, '/data/collections/'), (err, files) => {
    // create an empty array to store files
    let collections = [];
    // Loop over each 'file' in 'files'
    files.forEach((file) => {
      // parse each file using gray-matter
      let fileContent = matter.read(__dirname + '/data/collections/' + file.toString());
      collections.push(fileContent);
    });
    // render the page, pass in all the files as data
    res.render('services', { 'data': collections });
  })
})

router.get('/services/:page', function (req, res) {
  // If the link already has .md on the end (for GitHub docs)
  // remove this when we render the page
  if (req.params.page.slice(-3).toLowerCase() === '.md') {
    req.params.page = req.params.page.slice(0, -3)
  }
  // get the relevant file
  let fileLocation = path.join(__dirname, '/data/collections/' + req.params.page + '.md')
  // use matter to parse the data from the file
  var article = matter.read(fileLocation);
  // convert markdown in matter to html
  article.content = marked(article.content)
  // render the page, pass in the data
  res.render('services-template', { 'document': article })
})

module.exports = router

// Strip off markdown extensions if present and redirect
var redirectMarkdown = function (requestedPage, res) {
  if (requestedPage.slice(-3).toLowerCase() === '.md') {
    res.redirect(requestedPage.slice(0, -3))
  }
  if (requestedPage.slice(-9).toLowerCase() === '.markdown') {
    res.redirect(requestedPage.slice(0, -9))
  }
}
