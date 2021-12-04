//  It will contain most of the logic for fetching the data from each API endpoint.
const request = require('request');

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coord) => { //inside fetchMyIP to use variable ip
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coord, (error, passes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passes);
      });
    });
  });
};

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error,response,body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    const data = JSON.parse(body);
    callback(null, data.ip);
  });

  fetchCoordsByIP = function(ip, callback) {
    request(`https://freegeoip.app/json/${ip}`, (error,response,body) => {
    //request(`https://freegeoip.app/json/121212`, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        callback(`Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`, null);
        return;
      }
      const data = JSON.parse(body);
      const coord =  {latitude: data.latitude, longitude: data.longitude };
      callback(null, coord);
      return;
    });

    //input: lat, long, alt-, how many results to return
    //output: lat, long, alt, times, success or failure message , a list of passes (rise time and duration)
    
    fetchISSFlyOverTimes = function(coord, callback) {
      request(`https://iss-pass.herokuapp.com/json/?lat=${coord.latitude}&lon=${coord.longitude}`, (error, response, body)=> {
        if (error) {
          callback(error, null);
        }
        if (response.statusCode !== 200) {
          callback(`Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`, null);
          return;
        }
        const passes = JSON.parse(body).response;
        callback(null, passes);
      });
    };
  };
};

module.exports = { nextISSTimesForMyLocation };