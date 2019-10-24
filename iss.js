const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org?format=json', (error, resp, body) => {

    if (error) {
      return callback(error, null);
    }

    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }

    callback(null, JSON.parse(body).ip);

  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, resp, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body).data;

    callback(null, { latitude, longitude });

  });
};
module.exports = { fetchMyIP, fetchCoordsByIP };