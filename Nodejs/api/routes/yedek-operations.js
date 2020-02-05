const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth')
const multer = require('multer');
var exec = require('child_process').exec

// const spawn  = require('child_process').spawn;

// const upload = multer({dest: __dirname + '/'});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})
 
var upload = multer({ storage: storage })


router.post('/upload', upload.single('image'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log('Turning on green led...')
  var returnData = ""
  var child = exec('python ../Python/main.py')
  // var child = exec('dir')
  child.stdout.on('data', function(data) {
      console.log('stdout: ' + data)
      returnData = returnData + data
      // res.end(data)
  })
  child.stderr.on('data', function(data) {
      console.log('stdout: ' + data)
      returnData = returnData + data
      // res.end(data)
  })
  child.on('close', function(code) {
      console.log('closing code: ' + code)
      res.end(returnData)
  })
})
// 
// router.post('/upload', green); 
  
// function green(req, res) {

//   console.log('Turning on green led...')
//   var child = exec('python ../Python/main.py')
//   // var child = exec('dir')
  
//   child.stdout.on('data', function(data) {
//       console.log('stdout: ' + data)
//       res.send(data)
//   })
//   child.stderr.on('data', function(data) {
//       console.log('stdout: ' + data)
//       res.send(data)

//   })
//   child.on('close', function(code) {
//       console.log('closing code: ' + code)
//       res.send(code)
//   })
//   // res.redirect('/')
// }






module.exports = router