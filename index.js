"use strict";

const apiKey = "hPnejYCjDvhmMhTbYECuUq15682jUtDm";
const nytURL = "https://api.nytimes.com/svc/books/v3/lists/current/";
const nytGenresURL = "https://api.nytimes.com/svc/books/v3/lists/names.json?";
const googleKey = "AIzaSyD9OPopSiOT_qHbXpC9_MBK-1d83kvVVIs";
const googleURL = "https://www.googleapis.com/books/v1/volumes?";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function displayDetails(responseJson) {
  console.log(responseJson);
  $("#navigate")
    .empty()
    .append(
      `<p> \"${responseJson.items[0].volumeInfo.title}\" by: ${responseJson.items[0].volumeInfo.authors[0]}</p>`
    );
  $("#covers-list").addClass("hidden");
  $("#details-list").removeClass("hidden").append(
    `<li><image src="${responseJson.items[0].volumeInfo.imageLinks.thumbnail}"></li>
    <li><a href="${responseJson.items[0].volumeInfo.previewLink}" value="Preview">Preview</a></li>
    <li>${responseJson.items[0].volumeInfo.description}</li>`
  );
}
function getDetails(isbn13) {
  const params = {
    key: googleKey,
    q: "isbn=" + isbn13,
  };

  const queryString = formatQueryParams(params);
  const url = googleURL + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayDetails(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayList(responseJson) {
  console.log(responseJson);
  $("#navigate").empty().append(`<p>${responseJson.results.display_name}</p>`);
  $("#results-list").addClass("hidden");
  $("#covers-list").removeClass("hidden");
  for (let i = 0; i < responseJson.results.books.length; i++) {
    $("#covers-list").append(
      `<li><img src= ${responseJson.results.books[i].book_image} alt="cover" value= ${responseJson.results.books[i].primary_isbn13}>`
    );
  }
}

$("#covers-list").on("click", "img", function () {
  event.preventDefault();
  let isbn13 = $(this).attr("value");
  getDetails(isbn13);
});

$("#results").removeClass("hidden");

function getList(listName) {
  const params = {
    "api-key": apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = nytURL + listName + ".json?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayList(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayGenres(responseJson) {
  console.log(responseJson);
  $("#navigate").empty().append(`<p>Genres</p>`);
  $("#results-list").empty();
  for (let i = 0; i < responseJson.results.length; i++) {
    $("#results-list").append(
      `<li><a href="${responseJson.results[i].list_name_encoded}">${responseJson.results[i].display_name}</a></li>`
    );
  }
}

$("#results-list").on("click", "a", function () {
  event.preventDefault();
  let listName = $(this).attr("href");
  getList(listName);
});

$("#results").removeClass("hidden");

function getGenres(nytGenresURL) {
  const params = {
    "api-key": apiKey,
    updated: "weekly",
  };
  const queryString = formatQueryParams(params);
  const url = nytGenresURL + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayGenres(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

$("#start").on("click", function () {
  event.preventDefault();
  $("#splash").addClass("hidden");
  getGenres(nytGenresURL);
});
