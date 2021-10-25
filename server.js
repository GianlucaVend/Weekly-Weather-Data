// for the rest of the course will will start with this setp up:
const express = require("express");
const ejs = require("ejs");
const os = require("os");
const bodyParser = require("body-parser");

const masterWeather = require("./weather.js");
const cityWeather = masterWeather.cityWeather;
const arrayName = masterWeather.arrayName;
const cities = masterWeather.cities;

const app = express();

//Middleware

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Start server

let server = app.listen(3000, () => {
  console.log("server has started on port", server.address().port);
  let networkInfo = os.networkInterfaces();
  let network = networkInfo['Wi-Fi']
  //let network = networkInfo["Ethernet"];

  network.forEach((item) => {
    if (item.family == "IPv4") console.log("on IP adress:", item.address);
  });

  //console.log(networkInfo)
});
app.get("/weather/:city?/:day?", (req, res) => {
  if (req.params.city) {
    let city = req.params.city.toLowerCase();

    if (req.params.day) {
      let day = req.params.day.toLowerCase();
      if (city == "kingston") {
        //res.send(cityWeather[city]["kingston" + day.charAt(0).toLocaleUpperCase()+ day.slice(1)]);
        let data = {
          weather:
            cityWeather[city][
              "kingston" + day.charAt(0).toUpperCase() + day.slice(1)
            ],
        };
        res.render("daily", data);
        // change letter of the day varibale to uppcase to match what we have in weather.js
      } else if (city == "ottawa") {
        //res.send(cityWeather[city]["ottawa" + day.charAt(0).toLocaleUpperCase()+ day.slice(1)]);
        let data = {
          weather:
            cityWeather[city][
              "ottawa" + day.charAt(0).toUpperCase() + day.slice(1)
            ],
        };
        res.render("daily", data);
      } else if (city == "toronto") {
        //res.send(cityWeather[city]["toronto" + day.charAt(0).toLocaleUpperCase()+ day.slice(1)]);
        let data = {
          weather:
            cityWeather[city][
              "toronto" + day.charAt(0).toUpperCase() + day.slice(1)
            ],
        };
        res.render("daily", data);
      }
    } else {
      let data = { weather: arrayName[city] };
      res.render("weekly", data);
    }
  } else {
    let data = { weather: cities };
    //res.send(arrayName);
    res.render("master", data);
  }
});

//find warmest location for a given day
app.get("/warmest/:day", (req, res) => {
  let day = req.params.day.toLowerCase();

  var highestTemp = 0;
  var cityIndex = 0;
  var dayIndex = 0;

  for (var i = 0; i < cities.length; i++) {
    for (var d = 0; d < cities[i].length; d++) {
      if (
        cities[i][d].temp > highestTemp &&
        cities[i][d].Day.toLowerCase() == day
      ) {
        highestTemp = cities[i][d].temp;
        cityIndex = i;
        dayIndex = d;
      }
    }
  }
  let data = { weather: cities[cityIndex][dayIndex] };
  res.render("warmest", data);
  //cities[cityIndex][dayIndex];
});

//find warmest day for a given location
app.get("/warmestLocation/:location", (req, res) => {
  let location = req.params.location.toLowerCase();

  var highestTemp = 0;
  var dayIndex = 0;

  for (var i = 0; i < arrayName[location].length; i++) {
    if (arrayName[location][i].temp > highestTemp) {
      highestTemp = arrayName[location][i].temp;
      dayIndex = i;
    }
  }
  let data = { weather: arrayName[location][dayIndex] };
  res.render("warmestLocation", data);
  //cities[cityIndex][dayIndex];
});

// Find average weekly temperature for each of the locations
app.get("/average/:location", (req, res) => {
  let location = req.params.location.toLowerCase();

  var sum = 0; 
  for(var i = 0; i < arrayName[location].length; i++)
  {
    sum += arrayName[location][i].temp;
  }

  var average = sum / arrayName[location].length; 
  
  let data = {location:location, average: average}; 
  res.render("average", data);
  //cities[cityIndex][dayIndex];
});

//Find all the sunny days in the week for a given location.
app.get("/sunny/:location", (req,res) =>{
  let location = req.params.location.toLowerCase(); 

let data = {weather: arrayName[location]}; 
res.render("sunny", data);
})
