var express = require('express');
var bodyParser = require('body-parser');
var Library = require('../Library');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

// CREATES A NEW BOOK IN LIBRARY
router.post('/', function (req, res) {
  Library.create({
      title : req.body.title,
      author : req.body.author,
      publishDate : Date.now(),
      numberOfPages : req.body.numberOfPages,
      cover : req.body.cover
    },
    function (err, book) {
      if (err) return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(book);
    });
});

// RETURNS ALL BOOKS IN THE DATABASE
router.get('/', function (req, res) {

    Library.find({}, function (err, books) {
        if (err) return res.status(500).send("There was a problem finding books in library.");
        res.status(200).send(books);
    });

});
// GETS SINGLE BOOK FROM DB
router.get('/:id', function (req, res) {

    Library.findById(req.params.id, function (err, book) {
        if (err) return res.status(500).send("There was a problem finding book.");
        if (!book) return res.status(404).send("No book found.");
        res.status(200).send(book);
    });

});

// DELETES A BOOK FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Library.findByIdAndRemove(req.params.id, function (err, book) {
        if (err) return res.status(500).send("There was a problem deleting the book.");
        res.status(200).send("Book "+ book.title +" was deleted.");
    });
});

// UPDATES A SINGLE BOOK IN THE DATABASE
router.put('/:id', function (req, res) {
    Library.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, book) {
        if (err) return res.status(500).send("There was a problem updating the book.");
        res.status(200).send(book);
    });
});

module.exports = router;
