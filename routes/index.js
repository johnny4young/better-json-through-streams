var express = require('express');
var oboe = require('oboe');
var fs = require('fs');
var path = require('path');
var request = require('request');
var highland = require('highland');
var _ = require('lodash');

var points = require('../data/points');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', {
    script: 'data-full.js'
  });
});

router.get('/home', function(req, res) {
  res.render('home', {
    script: 'data-full.js'
  });
});

router.get('/full-data', function(req, res) {
  var response = {
    exif: {
      software: 'http://make8bitart.com',
      dateTime: '2015-11-07T15:35:13.415Z',
      dateTimeOriginal: '2015-11-07T00:24:05.776Z'
    },
    pixif: {
      pixels: ["#{pixels}"]
    },
    madeBy: 'Juan Caicedo'
  };

  var json = JSON.stringify(response);
  var parts = json.split('"#{pixels}"');

  var pointStream = points.getFullStream()
        .map(JSON.stringify)
        .intersperse(',');

  highland([
      parts[0],
      pointStream,
      parts[1]
    ])
    .invoke('split', [''])
    .sequence()
    .pipe(res);
});

router.get('/fs-async', function(req, res) {
  res.render('home', {
    script: 'data-fs-async.js'
  });
});

router.get('/data-fs-async', function(req, res) {
  var catPath = path.join(__dirname, '../data/cat-points.json');
  fs.readFile(catPath, function(err, data){
    res.send(data);
  });
});

router.get('/fs-read-stream', function(req, res) {
  res.render('home', {
    script: 'data-fs-read-stream.js'
  });
});

router.get('/data-fs-read-stream', function(req, res) {
  var catPath = path.join(__dirname, '../data/cat-points.json');
  var pointStream = fs.createReadStream(catPath);
  pointStream.pipe(res);
});

module.exports = router;
