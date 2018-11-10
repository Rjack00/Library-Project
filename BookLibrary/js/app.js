(function () {
  //Libary construct
  // var Library;

  var instance;
  class Library {
    constructor() {
      if (!instance) {
        // this.libraryKey = instanceKey;
        this.myBookArray = [];
        this.d_table = {};
        this.m_table = {};
        instance = this;
        this.selectedBook = {};
        return instance;
      }
    }

    //////////////////// init //////////////////////////////

    init() {
      this.makeRequest();
      this.$formTable = $(".staticForm form").clone();
      this._findElements();
      this._bindEvents();
      // this.getObject(this.libraryKey);
      this.buildTable();
      
    }

    ////////////////// bind events ///////////////////////

    _bindEvents() {
      $("#table_id").on("click", ".editButton2", $.proxy(this.editHandler, this));
      $("#saveChanges").on("click", $.proxy(this.editSaveHandler, this));
      // $("#table_id").on("blur", $.proxy(this.saveChangesAjax, this));
      $('#authorButton').on("click", $.proxy(this._handleAllAuthors, this));
      $("#table_id").on("click", ".deleteButton", $.proxy(this._deleteButton, this));
      this.$mtable.on("click", 'tbody button', $.proxy(this._deleteAuthor, this));
      $("#addButton").on("click", $.proxy(this._handleAddBookBtn, this));
      $("#random-book").on("click", $.proxy(this._handleRandomBookBtn, this));
      $(".anotherBook").on("click", $.proxy(this._handleAnotherBook, this));
      $("#editButton2").on("click", $.proxy(this._handleAlert, this));


    }
    _handleAlert() {
     console.log("fired");
      return false;
    }

    ////////////////////// builds table /////////////////////////////

    buildTable() {
      
      this.d_table = $("#table_id").DataTable({
        data: this.myBookArray,
        columns: [
          {
            data: function (data, type, row) {
              return '<img src="' + data.cover + '" class="cover">';
            }
          },
          { data: 'title' },
          { data: 'author' },
          { data: 'numberOfPages'},
          { data: 'fullYear' },
          { data: '_id' },
          {
            data: function (data, type, row) {
              return ('<button id="editButton" type="button" class="btn btn-outline-warning mt-3 editButton2" data-toggle="modal" data-target="#editModal" >EDIT</button>'    
              );

            }
          },
          {
            data: function (data, type, row) {
              return (
                '<button type="button" class="btn btn-outline-danger mt-3 deleteButton">X</button>'
              );

            }
          }
        ]
      });
      var self = this
      var table = $('#table_id').DataTable();
      $('#table_id tbody').on( 'click', 'tr', function () {
        self.selectedRow= table.row( this ).data();

      //console.log(table.row( this ).data());
      } );
    }


    ////////////////////// table delete button ///////////////////////

    _deleteButton(e) {
      var row = $(e.currentTarget).parent().parent();
      console.log("_deleteButton");
      var title = row.children()[1].innerText;
      console.log("title:", title);
      this.removeBookByTitle(title);
      this.d_table.row(row).remove();
      this.d_table.draw(false);

    }

    /////////////////////// authors modal-table //////////////////////

    _deleteAuthor(e) {
      var _this = this;
      var row = $(e.currentTarget).parent().parent();
      var author = row.children()[0].innerText;
      this.removeBookByAuthor(author);
      var count = this.d_table.data().count();
      let rows = this.d_table.rows(function(id, data) {
        console.log(data.author);
        return (data.author === author) ? true : false;
      })
      rows.each(function (row) {
        console.log(row);
        _this.d_table.row(row).remove();
      })
      this.d_table.draw(false);

    }
    _getAuthors() {
      this.m_table = this.$mtable.dataTable({
        data: (this.getAuthors()).map(v => [v]),
        columns: [
          { title: 'Author' },
          {
            data: function (data, type, row) {
              return '<button type="button" class="btn btn-outline-danger deleteButton">Delete</button>';
            }
          }
        ]
      });
    }

    //////////////////// handle all authors button /////////////////////

    _handleAllAuthors () {
      
      this._getAuthors();
    }

    /////////////////// Edit handler //////////////////////////////

    editHandler(e) {
    
      this.selectedBook = new Book (this.selectedRow);
      console.log('edithandler:', this.selectedBook);
      $(".editCover").val(this.selectedBook.cover);
      $(".editTitle").val(this.selectedBook.title);
      $(".editAuthor").val(this.selectedBook.author);
      // $(".editPages").val(selectedBook.numberOfPages);
      // $(".editDate").val(selectedBook.publishdate);
     
     
        
        
      }
      editSaveHandler(e) {    
        console.log($("#editCover").val());
      //pull data from edit modal
        var editedBook = this.selectedBook;
        editedBook.cover = $("#editCover").val();
        editedBook.title = $("#editTitle").val();
        editedBook.author = $("#editAuthor").val();

       //call ajax put(editedBook)
        this.saveChangesAjax(editedBook);
        $("#exampleModal1").modal('hide');
      }
    

    /////////////////// random book handler ///////////////////////////////

    _handleRandomBookBtn() {
      var randomBook = this.getRandomBook();
      console.log("_handleRandomBook:",randomBook)
      this.$randomCover.attr("src", randomBook.cover);
      this.$randomTitle.text(randomBook.title);
      this.$randomAuthor.text(randomBook.author);
      this.$randomPageNum.text(randomBook.numberOfPages);
      var c = randomBook.fullYear();
      this.$randomPubDate.text(randomBook.fullYear());
      this.$randomID.text(randomBook._id);
    }

    /////////////////// find elements ///////////////////////////////////

    _findElements() {
      this.$table = $('#table_id');
      this.$mtable = $('#modal-table');
      this.$randomCover = $(".bookCover");
      this.$randomTitle = $(".book-title");
      this.$randomAuthor = $(".book-author");
      this.$randomPageNum = $(".book-pageNum");
      this.$randomPubDate = $(".book-pubDate");
      this.$randomID = $(".book-id");
    }

    /////////////////// add a new book button jQ //////////////////////////////

    _handleAddBookBtn(e) {
      e.stopPropagation();
      var covers = $(".formCover");
      var titles = $(".formTitle");
      var authors = $(".formAuthor");
      var pages_array = $(".formPages");
      var dates = $(".formPubDate");
      for (var index = 0; index < titles.length; index++) {
        var cover = $(covers[index]).val();
        var title = $(titles[index]).val();
        var author = $(authors[index]).val();
        var pages = $(pages_array[index]).val();
        var date = $(dates[index]).val();
        var book = new Book({ cover: cover, title: title, author: author, numberOfPages: pages, publishDate: date });
        // debugger
        this.addBook(book);
        console.log(book);
        
      }
      this.d_table.draw();
      $(".staticForm").empty();
      $("#exampleModal1").modal('hide');
      // $(".staticForm").append(this.$formTable.clone());
    }


    ///////////////////// Add another book - button handler //////////////////////////////////

    _handleAnotherBook(e) {
      e.stopPropagation();
      console.log("anotherBook");
      $(".staticForm").append(this.$formTable.clone());
    }

    ///////////////////// Add allBooks button (not working) ///////////////////////////////////////

    // _handleAllBooksBtn() {
    //   gLib1.addBooks(moreBooks);
    //   var cover = $(".formCover").val();
    //   var title = $(".formTitle").val();
    //   var author = $(".formAuthor").val();
    //   var pages = $(".formPages").val();
    //   var date = $(".formPubDate").val();
    //   var button = $(".formRemoveImage").val();
    //   var book = new Book({ cover: cover, title: title, author: author, numberOfPages: pages, publishDate: date });
    //   this.d_table.fnAddData(book);
    //   this.d_table.fnDraw();
    // }

    ///// addBook to myBookArray function
    
    addBook(book, callbackFunction) {
      for (var i = 0; i < this.myBookArray.length; i++) {
        console.log(book);
        console.log(this.myBookArray[i].title.toUpperCase(),book.title.toUpperCase());
        if (this.myBookArray[i].title.toUpperCase() === book.title.toUpperCase()) {
          alert("Duplicate book");
          $("#exampleModal1").modal("hide");
          return false;
        }
      }
      this.addBookAjax(book);
      return true;
      
    }

    /////// removeBookByTitle function

    removeBookByTitle(title) {
      for (var i = 0; i < this.myBookArray.length; i++) {
        if (this.myBookArray[i].title.toUpperCase() === title.toUpperCase()) {
          console.log("before ajax");
          this.deleteBookAjax(this.myBookArray[i]);
          console.log("after ajax");
          this.myBookArray.splice(i, 1);
          $('#table_id').dataTable().fnDraw();
          return true;
        }
      }
      return false;
    }

    /////// removeBookByAuthor function

    removeBookByAuthor(author) {
      var result = false;
      for (var i = this.myBookArray.length - 1; i >= 0; i--) {
        if (this.myBookArray[i].author.toUpperCase() === author.toUpperCase()) {
          this.deleteBookAjax(this.myBookArray[i]);
          result = true;
        }
      }
      return result;
    }

    /////// getRandomBook function

    getRandomBook() {
      if (this.myBookArray.length == 0) {
        return null;
      }
      return this.myBookArray[Math.floor(Math.random() * this.myBookArray.length)];
    }

    /////// getBookByTitle(title)

    getBookByTitle(title) {
      var matchingTitles = [];
      for (var i = 0; i < this.myBookArray.length; i++) {
        if (RegExp(title.toUpperCase(), "i").test(this.myBookArray[i].title.toUpperCase())) {
          matchingTitles.push(this.myBookArray[i].title);
        }
      }
      return matchingTitles;
    }

    //////// getBookByAuthor(authorName)

    getBookByAuthor(authorName) {
      var matchingTitles = [];
      for (var i = 0; i < this.myBookArray.length; i++) {
        if (RegExp(authorName.toUpperCase(), "i").test(this.myBookArray[i].author.toUpperCase())) {
          matchingTitles.push(this.myBookArray[i].author);
        }
      }
      return matchingTitles;
    }

    //////// addBooks(books)

    addBooks(books) {
      var count = 0;
      for (var i = 0; i < books.length; i++) {
        if (this.addBook(books[i])) {
          count += 1;
        }
      }
      return count;
    }

    /////// getAuthor()

    getAuthors() {
      var authorsArray = [];
      for (var i = 0; i < this.myBookArray.length; i++) {
        if (authorsArray.indexOf(this.myBookArray[i].author) === -1) {
          authorsArray.push(this.myBookArray[i].author);
        }
      }
      console.log(authorsArray);
      return authorsArray;
    }

    //////// getRandomAuthorName function

    getRandomAuthorName() {
      if (this.myBookArray.length == 0) {
        return null;
      }
      return this.myBookArray[Math.floor(Math.random() * this.myBookArray.length)].author;
    }

    //////// betterSearch

    betterSearch(string) {
      var matchingItems = [];
      matchingItems.push(this.getBookByTitle(string));
      matchingItems.push(this.getBookByAuthor(string));
      return matchingItems;
    }


    ////////////// Ajax request for API to replace local storage///

    makeRequest() {
      let _this = this;
      $.ajax({
        dataType: 'json',
        type: "GET",
        url: 'http://localhost:3000/library'
      }).done(function (response) {
        console.log("response:", response);
        for (let i = 0; i < response.length; i++) {
          let book = new Book(response[i]);
          _this.myBookArray.push(book);
          console.log(book);
          console.log("_this.myBookArray:", _this.myBookArray);
          _this.d_table.row.add(book);
          
        }
        
        _this.d_table.draw();
      }).fail(function () {
        console.log("fail")
      })
    }

    ////////////// ajax post to add book //////////////////

    addBookAjax(book) {
      console.log("Im here");
      let _this = this;
      $.ajax({
        dataType: 'json',
        type: "POST",
        url: 'http://localhost:3000/library',
        data: book
      }).done(function (response) {
        console.log("addBookAjaxResponse:",response);
        var bookToAdd = new Book(response);
        _this.myBookArray.push(bookToAdd);
        console.log("addBookAjax-bookToAdd:", bookToAdd);
        _this.d_table.row.add(bookToAdd);
        _this.d_table.draw();
      }).fail(function () {
        console.log("fail")
      })
    }
    ///////////////// Ajax put ///////////////////////////

    saveChangesAjax(editedBook) {
      console.log("Im here",editedBook);
      let _this = this;
      $.ajax({
        dataType: 'json',
        type: "PUT",
        url: 'http://localhost:3000/library/' + editedBook._id,
        data: editedBook
      }).done(function (response) {
        console.log("addBookAjaxResponse:",response);
        var bookToAdd = new Book(response);
        _this.myBookArray.push(bookToAdd);
        console.log("addBookAjax-bookToAdd:", bookToAdd);
        _this.d_table.row.add(bookToAdd);
        _this.d_table.draw();
      }).fail(function () {
        console.log("fail")
      })
    }

    ///////////////// Ajax delet ////////////////////////

    deleteBookAjax(book) {
      console.log("ajax");
      let _this = this;
      $.ajax({
        dataType: 'json',
        type: "DELETE",
        url: 'http://localhost:3000/library/' + book._id,
        path: "/:id"
      }).done(function(response){
        console.log(response);

      }).fail(function (response) {
        console.log(response);
      })
    }

    //////// localstorage

      // setObject(instanceKey) {
      //   localStorage.setItem(instanceKey, JSON.stringify(this.myBookArray));
      //   return instanceKey;
      // }
      // getObject(instanceKey) {
      //   var localBooks = localStorage.getItem(instanceKey);
      //   if (localBooks !== null) {
      //     var parsedBooks = JSON.parse(localBooks);
      //     for (var index = 0; index < parsedBooks.length; index++) {
      //       this.addBook(new Book(parsedBooks[index]));
      //     }
      //   }
      // }
    }
    class Book {
      constructor(arg) {
        this._id = arg._id;
        this.cover = arg.cover;
        this.title = arg.title;
        this.author = arg.author;
        this.numberOfPages = arg.numberOfPages;
        this.publishDate = new Date(arg.publishDate);
        console.log("new book", arg);
      }
      fullYear() {
        return this.publishDate.getFullYear();
      }
    }




    ///////////////// document ready ////////////////////////////////

    $(document).ready(function() {
      window.gLib1 = new Library("gLib1");
      gLib1.init();
      // gLib1.addBooks(moreBooks);

    });



/////// Lib Instance

let gLib1 = new Library("gLib1");
let gLib2 = new Library("gLib2");


  /////// Book Instances

  var gIt = new Book({ cover: "images/it-image.jpg", title: "IT", author: "Stephen King", numberOfPages: 800, publishDate: "December 17, 1995" });
  var gCatcherInTheRye = new Book({ cover: "images/catcher-image.jpg", title: "Catcher In The Rye", author: "JD Salinger", numberOfPages: 200, publishDate: "December 25, 1987" });
  var gGoodBook = new Book({ cover: "images/good-book.jpg", title: "A Good Book", author: "Someone Good", numberOfPages: 200, publishDate: "Jan 1, 2001" });
  var gBetterBook = new Book({ cover: "images/better.jpg", title: "A Better Book", author: "Someone Good", numberOfPages: 200, publishDate: "Jan 2, 2001" });
  var gGoodToGreat = new Book({ cover: "images/good-great.jpg", title: "Good To Great", author: "Jim Collins", numberOfPages: 320, publishDate: "October 16, 2001" });
  var gPapillon = new Book({ cover: "images/papillon-image.jpg", title: "Papillon", author: "Henri Charriere", numberOfPages: "500", publishDate: "December, 1970" })
  var g1984 = new Book({ cover: "images/image-1984.jpg", title: "Ninteen Eighty-Four", author: "George Orwell", numberOfPages: "500", publishDate: "1949" })
  var gHitchhikersGuide = new Book({ cover: "images/hitchhikers-image.jpg", title: "Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", numberOfPages: "500", publishDate: "October 12, 1979" })
  var gRobinsonCrusoe = new Book({ cover: "images/crusoe-image.jpg", title: "Robinson Crusoe", author: "Daniel Defoe", numberOfPages: "500", publishDate: "April 25, 1719" })
  var gJourneyToTheCenterOfTheEarth = new Book({ cover: "images/journey-image.jpg", title: "Journey to the Center of the Earth", author: "Jules Verne", numberOfPages: "500", publishDate: "November 25, 1864" })
  var gMereChristianity = new Book({ cover: "images/mere-image.jpg", title: "Mere Christianity", author: "C.S. Lewis", numberOfPages: "500", publishDate: "1952" })
  var gBeowulf = new Book({ cover: "images/beowulf-image.jpg", title: "Beowulf", author: "Unknown", numberOfPages: "500", publishDate: "1000" })
  var gBandOfBrothers = new Book({ cover: "images/band-bros.jpg", title: "Band of Brothers", author: "Stephen E. Ambrose", numberOfPages: "336", publishDate: "1992" })


  ///////array of addBooks

  var moreBooks = ([gIt, gCatcherInTheRye, gGoodBook, gGoodToGreat, gPapillon, g1984, gHitchhikersGuide, gRobinsonCrusoe, gJourneyToTheCenterOfTheEarth, gMereChristianity, gBeowulf, gBandOfBrothers]);
})();
