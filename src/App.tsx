import axios from "axios";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCloud,
  faSun,
  faCloudSun,
  faSnowflake,
  faCloudRain,
  faBolt,
  faSmog,
  faCloudShowersHeavy,
} from "@fortawesome/free-solid-svg-icons";

const searchIcon = <FontAwesomeIcon icon={faSearch} />;

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
    tz_id: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    wind_kph: number;
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedCity, setDebouncedCity] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [bgImage, setBgImage] = useState<string>("/bg.jpg");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCity(city);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [city]);

  useEffect(() => {
    if (!debouncedCity) {
      setWeatherData(null);
      setError("");
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const API_KEY = "fea8ffee72d14c349ba12734250304";
        const res = await axios.get<WeatherData>(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${debouncedCity}`
        );
        setWeatherData(res.data);
      } catch (error) {
        console.log("Error fetching data", error);
        setError("No results found...");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [debouncedCity]);

  useEffect(() => {
    if (weatherData) {
      const formattedTime3 = parseInt(
        moment.tz(weatherData.location.tz_id).format("HH")
      );

      if (formattedTime3 >= 1 && formattedTime3 < 6) {
        setBgImage("/dawn.jpg");
      } else if (formattedTime3 > 6 && formattedTime3 < 12) {
        setBgImage("/morning.jpg");
      } else if (formattedTime3 > 12 && formattedTime3 < 18) {
        setBgImage("/afternoon.jpg");
      } else if (formattedTime3 > 18 && formattedTime3 < 24) {
        setBgImage("/night.jpg");
      } else {
        setBgImage("/bg.jpg");
      }
    }
  }, [weatherData]);

  const formattedDate = weatherData?.location.localtime
    ? new Date(weatherData.location.localtime).toUTCString().slice(0, 16)
    : "";

  const formattedTime = weatherData
    ? moment.tz(weatherData.location.tz_id).format("hh:mm")
    : "";

  const formattedTime2 = weatherData
    ? moment.tz(weatherData.location.tz_id).format("A")
    : "";

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <FontAwesomeIcon icon={faSun} />;
      case "cloudy":
        return <FontAwesomeIcon icon={faCloud} />;
      case "partly cloudy":
        return <FontAwesomeIcon icon={faCloudSun} />;
      case "snow":
        return <FontAwesomeIcon icon={faSnowflake} />;
      case "rain":
      case "light rain":
      case "showers":
        return <FontAwesomeIcon icon={faCloudRain} />;
      case "thunderstorm":
      case "storm":
      case "thunder":
        return <FontAwesomeIcon icon={faBolt} />;
      case "fog":
      case "mist":
      case "haze":
        return <FontAwesomeIcon icon={faSmog} />;
      case "heavy rain":
      case "downpour":
        return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
      default:
        return <FontAwesomeIcon icon={faCloud} />;
    }
  };

  return (
    <>
      <div
        className="absolute w-full h-[100vh] bg-cover bg-center transition-all duration-500 opacity-[0.8] z-[-1]"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="text-[#393939] flex flex-col gap-8 justify-center items-center w-full h-[100vh] mona p-8">
        <div className="text-gray-400 border-gray-300 bg-white rounded-md px-4 py-2 flex justify-center items-center sm:w-100 lg:w-120">
          <input
            type="text"
            placeholder="Search city..."
            className="in w-full outline-0"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {searchIcon}
        </div>
        <div>
          {loading ? (
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          ) : weatherData ? (
            <div className="flex flex-col gap-2 justify-center items-center backdrop-blur-xl rounded-xl p-6 shadow-md min-w-[200px] max-w-[500px]">
              <p className="text-5xl lg:text-[70px] text-gray-800 text-center">
                {weatherData?.location.name}
              </p>
              <p className="flex justify-center items-center gap-3 text-blue-300 text-4xl">
                {getWeatherIcon(weatherData?.current.condition.text || "")}
                {weatherData?.current.temp_c} °c
              </p>
              <div className="flex flex-col justify-center items-center text-gray-700 h-[fit-content] rounded-xl bg-gray-300/40 py-2 px-7 mt-8">
                <div className="flex justify-center items-center">
                  <p className="text-5xl">{formattedTime}</p>
                  <p>{formattedTime2}</p>
                </div>
                <p>{formattedDate}</p>
              </div>
            </div>
          ) : (
            <p>{error}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
