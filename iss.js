
const request = require('request')
const nextISSTimesForMyLocation = function(callback) {
  
  const fetchMyIP = function(callback) { 
    request('https://api.ipify.org?format=json',(error, response, body) =>  {
      if (error) {
        callback(error, null)
        return;
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    } 
    const fetchCoordsByIP = function(ip, callback ) {
      request(`https://ipvigilante.com/json/${ip}`,(error, response, body) =>  {
        if (error) {
          callback(error, null)
          return;
        } else {

          const { latitude, longitude } = JSON.parse(body).data;

          return callback(null, {latitude,longitude})
        }
      }


      const fetchISSFlyOverTimes = function(coords, callback) {
        request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude} &lon=${coords.longitude}`, (error, response, body) =>  {
          if (error) {
            callback(error, null)
            return;
          }
          if (response.statusCode !== 200) {
            callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
            return; 
          } else {
            const times = JSON.parse(body).response;
            return callback(null, times)
          }
        });
      })
    })
  }

}
module.exports =  { nextISSTimesForMyLocation }

