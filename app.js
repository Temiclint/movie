// jshint esversion:6

const express = require("express");
const https = require("https");
// const http = require("http");
const bodyParser = require("body-parser")
const open = require("open")


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"))

app.get('/', (req, res) => {


  res.sendFile(__dirname + "/index.html");
})



app.post("/", function(req, res){



const query = req.body.searchtitle;
const url = "https://www.omdbapi.com/?s=" + query + "&apikey=ea834229"
https.get(url, function(response) {

  console.log(response.statusCode);

  let chunks = []
  response.on("data", function(data) {

    chunks.push(data);
  });

  response.on("end", function() {

    let data = Buffer.concat(chunks)
    const movD = JSON.parse(data);
    console.log(movD)
    let movies = movD.Search;

    // console.log(movies);
    let output = " "
    movies.forEach((index, movie) => {
      output += `

      <div class ="movieposter">
        <img class="movieImg" src="${index.Poster}">
        <h3 class="movieTitle">${index.Title}"</h3>
        <a onclick="movieSelected"('${index.imdbID}')" class="btnDetails" href="#">Movie Details </a>
        </div>

    `;


    });
    res.write(`<!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="css/style.css" type="text/css">
      <title>Movie</title>
    </head>

    <body>
      <nav>
        <div class="container-fluid">
          <a class="navbar-brand" href="#">MOVIE APP</a>
        </div>
        <ul class="navigationUl">
          <li class="nav-links">Home</li>
          <li class="nav-links">Top Movies</li>
          <li class="nav-links">Developer Details</li>
        </ul>

      </nav>
      <hr class="hr-one">

    <div class="searchbox">
      <form action="/" method="post" class="search">
        <label class = "searchlabel"for="">Search Movie</label>
        <input type="text" placeholder="Movie title" name="searchtitle" id ="titleinput" >
         <button type="submit"  class ="searchbtn" name="button">Search</button>
      </form>
    </div>
<div class="container">
    ${output}
<div>



    </body>

    </html>
    `);
    res.send();
  })

})
})

app.listen(3000, function() {
  console.log("server running port 3000")
})
