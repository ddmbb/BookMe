"use strict";

const apiKey = "hPnejYCjDvhmMhTbYECuUq15682jUtDm";
const nytURL = "https://api.nytimes.com/svc/books/v3/lists/current/";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}


$("#results-list").on("click", "li", function () {
  event.preventDefault();
  console.log(isbn);
  /*$("#js-list-name").addClass("hidden");*/
});

/*pulls up individual best sellers lists*/
function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  for (let i = 0; i < responseJson.results.books.length; i++) {
    let isbn = responseJson.results.books.primary_isbn;
    $("#results-list").append(
      `<li><img src= ${responseJson.results.books[i].book_image} alt="cover">`
    );
  }
  $("#results-list").on("click", "li", function () {
    event.preventDefault();
    console.log(isbn);
    /*$("#js-list-name").addClass("hidden");*/
  });
  $("#results").removeClass("hidden");
}

function getList(listName) {
  const params = {
    "api-key": apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = nytURL + listName + ".json?" + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("#js-list-name").on("click", "button", function () {
    event.preventDefault();
    var listName = this.value;
    getList(listName);
    /* $("#js-list-name").addClass("hidden"); */
  });
}

$(watchForm);
