var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/news_db", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://slashdot.org/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $("span.story-title").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

app.get("/", function (req, res) {

  // TODO: Finish the route so it grabs all of the articles

  db.Article.find({}).populate("comments").then(function (data) {

    res.render("index", { articles: data });

  }).catch(function (err) {

    res.json(err);

  });

});



// Route for grabbing a specific Article by id, populate it with it's note

app.get("/articles/:id", function (req, res) {

  // TODO

  // ====

  // Finish the route so it finds one article using the req.params.id,

  // and run the populate method with "note",

  // then responds with the article with the note included

  db.Article.findById(req.params.id).populate("comments").then(function (data) {

    res.json(data);

  }).catch(function (err) {

    res.json(err);

  });



});



// Route for saving/updating an Article's associated Note

app.post("/articles/:id", function (req, res) {

  // TODO

  // ====

  // save the new note that gets posted to the Notes collection

  // then find an article from the req.params.id

  // and update it's "note" property with the _id of the new note

  db.Comment.create(req.body).then(function (dbComment) {

    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment } }).then(function (dbRes) {

      res.redirect("/");

    });

  })



});



app.post("/articles/delete/:id", function (req, res) {

  db.Comment.remove({ _id: req.params.id }).then(function (dbRemove) {

    res.json(dbRemove);

  });

});



app.post("/articles/save/:id", function (req, res) {

  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (dbRes) {

    res.redirect("/");

  })

})



app.post("/articles/unsave/:id", function (req, res) {

  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }).then(function (dbRes) {

    res.redirect("/");

  })

})



app.get("/savedarticles", function (req, res) {

  // TODO: Finish the route so it grabs all of the articles

  db.Article.find({ saved: true }).populate("comments").then(function (data) {

    res.render("saved", { articles: data });

  }).catch(function (err) {

    res.json(err);

  });

});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
