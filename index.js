// index.js
const { nextISSTimesForMyLocation } = require('./iss');
const { printPassTimes } = require('./printPassTimes');

nextISSTimesForMyLocation((error, passes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passes);
});


