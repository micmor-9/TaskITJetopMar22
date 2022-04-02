const express = require('express');
const request = require('request');
const app = express();
const port = 80;

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

app.get('/weather', (req, res) => {
  //Getting query parameters
  let city = req.query.city;
  let date = req.query.date;
  if(city && date) {
    //If query parameters set
    let today = dayjs().hour(0).minute(0).second(0).format();
    let _date = dayjs(date, 'DD-MM-YY').format();

    //Check if provided date is within 5 days
    if(dayjs(_date).isAfter(dayjs(today).add(5,'day'))) {
      res.send({"error":"Date is after 5 days from now. Forecast not available."});
      return;
    } else if (dayjs(_date).isBefore(dayjs(today))) {
      res.send({"error":"Date is in the past. Forecast not available."});
      return;
    }

    //API request
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=898b462131c70ac71118dc72ae1f47f2`;
    request(url, function(error, response, body) {
      if(!error) {
        let result = JSON.parse(body);
        if(result.cod != 200) {
          res.send({"error":"Bad request format."});
          return;
        }
        //Select results for the requested date
        result = result.list.filter(function(item){ return item.dt_txt.startsWith(dayjs(_date).format('YYYY-MM-DD')); });
        
        if(result.length == 0) {
          res.send({"error":"No forecast available."});
          return;
        } 
        
        //Central array element is chosen to get the forecast of the selected date that represents better the average
        let formattedResult = {};
        formattedResult.main = result[Math.floor(result.length/2)].main;
        formattedResult.weather = result[Math.floor(result.length/2)].weather;
        delete formattedResult.weather[0].id;
        delete formattedResult.weather[0].icon;
        
        console.log(formattedResult);
        res.send(JSON.stringify(formattedResult));
      } else {
        res.send(error);
      }
    });
  } else {
    res.send({"error":"Wrong request. Provide city and date!"});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});