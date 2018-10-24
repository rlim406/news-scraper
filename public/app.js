
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append("<button data-id='" + data._id + "' id='savearticle'>Save Article</button>");
  }
});

$.getJSON("/notes", function (data) {

  for (var i = 0; i < data.length; i++) {

    $("#savedNotes").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "</p>");
    $("#savedNotes").append("<button data-id='" + data._id + "' id='deleteNote'>deleteNote</button>");
  }
});

$.getJSON("/articles/:id", function (data) {

  for (var i = 0; i < data.length; i++) {

    $("#savedArticle").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$(document).on("click", "p", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savearticle", function () {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "GET",
    url: "/articles/:id" + thisId,
  })

    .then(function (data) {
      data.title,
        data.link
    });

});

$(document).on("click", "#savenote", function () {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })

    .then(function (data) {

      console.log(data);

      $("#notes").empty();
    });


  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deleteNote", function () {

  var thisId = $(this).attr("data-id");

  $.ajax({
    type: "GET",
    url: "/delete/" + thisId,

    success: function (response) {
      thisId.remove();
    }
  });
});
