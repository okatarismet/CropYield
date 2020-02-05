const express = require('express');
const router = express.Router();
const multer = require('multer');
const exec = require('child_process').exec

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})
 
const upload = multer({ storage: storage })

router.post('/upload', upload.single('image'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let returnData = ""
  const child = exec('python ../Python/main.py')
  child.stdout.on('data', function(data) {
      console.log('stdout: ' + data)
      returnData = returnData + data
  })
  child.stderr.on('data', function(data) {
      console.log('stdout: ' + data)
      returnData = returnData + data
  })
  child.on('close', function(code) {
      console.log('closing code: ' + code)
      res.end(returnData)
  })
})

module.exports = router