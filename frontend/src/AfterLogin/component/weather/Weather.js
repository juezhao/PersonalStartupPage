import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../../AppContextProvider";

const URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "071f6f351c77c8f244e6e98ac8e1af10";

const Weather = ({ mouseIn }) => {
  //Set State for weather
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);

  const { authState, setAuthState } = useContext(AppContext);

  //Get weather data from GeoLocation API and openWeather API, set state, error, loading based on response
  useEffect(() => {
    setAuthState({ ...authState, loadingWeather: true });
    function getCoordintes() {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      async function success(pos) {
        let crd = pos.coords;
        let lat = crd.latitude.toString();
        let lng = crd.longitude.toString();
        // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        const { data } = await axios.get(URL, {
          params: {
            lat: lat,
            lon: lng,
            units: "metric",
            APPID: API_KEY,
          },
        });
        // console.log(data);
        if (data && data.cod === 200) {
          setAuthState({ ...authState, loadingWeather: false });
          setWeather(data);
          setError(false);
        } else {
          setAuthState({ ...authState, loadingWeather: false });
          setError(true);
        }
        return data;
      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    }
    getCoordintes();
  }, []);

  return (
    <div
      className="main-container"
      style={{ display: "block" }}
    >
      {error && (
        <div className="error" style={{ color: "white" }}>
          Error! Can not get the weather detail!
        </div>
      )}
      {authState.loadingWeather && (
        <div className="loading" style={{ color: "white" }}>
          Loading the weather...
        </div>
      )}
      {weather.main && (
        <div className="city">
          <div className="date"> {new Date().toDateString("en-US")}</div>

          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
