// https://openweathermap.org/current

// Configuration
const DEFAULT_LANGUAGE = 'fr';
const DEFAULT_UNITS = 'metric';
const DEFAULT_CITY = 'Paris';
const DEFAULT_HIGH_ACCURACY = true;
const API_KEY = 'c4c65d0492f9ba942bc94c8aed65511c';

// DOM elements
let select_city_btn = document.querySelector('#select-city');
let locate_city_btn = document.querySelector('#locate-city');
let city_elem = document.querySelector('#city');
let temperature_elem = document.querySelector('#temperature');
let weather_icon = document.querySelector('#weather-icon');
let description = document.querySelector("#description");
let feels_like = document.querySelector('#feels-like');
let humidity = document.querySelector('#humidity');
let min_temperature = document.querySelector("#min");
let max_temperature = document.querySelector("#max");

let city = DEFAULT_CITY;
let units_parameter = `&units=${DEFAULT_UNITS}`;
let api_key_parameter = `&appid=${API_KEY}`;
let lang_parameter = `&lang=${DEFAULT_LANGUAGE}`;


// Update weather information using data from a call to request_url
function update_temperature(request_url) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 404) {
                alert('Ville inconnue');
            }
            else if (request.status == 200) {
                let response = JSON.parse(request.response);
                // Update city name
                city = response.name;
                city_elem.textContent = response.name;
                // Save city name in local storage
                localStorage.setItem('city', city);

                // Update temperatures
                temperature_elem.textContent = `${response.main.temp} °`
                feels_like.textContent = response.main.feels_like;
                // Update icon and other informations
                update_icon(response.weather[0].icon);
                humidity.textContent = response.main.humidity;

                weather_icon.classList.remove('invisible');
                description.textContent = response.weather[0].description;
                min_temperature.textContent = response.main.temp_min;
                max_temperature.textContent = response.main.temp_max;
            } else {
                alert("Une erreur s'est produite, merci de réessayer plus tard.");
            }
        }
    };
    request.open('GET', request_url);
    request.responseType = 'JSON';
    request.send();
}


function update_from_location() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            // Location success
            (position) => {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                // Build the request string from coordinates and update
                let url_request_coords = 'https://api.openweathermap.org/data/2.5/weather?' +
                    `lat=${latitude}&lon=${longitude}` + units_parameter + lang_parameter + api_key_parameter;
                update_temperature(url_request_coords);
            },
            // Location fail
            (error) => {
            },
            // Options
            {
                enableHighAccuracy: DEFAULT_HIGH_ACCURACY
            }
        );
    } else {
        console.log('Géolocalisation indisponible');
    }
}


// Set select city button click event
select_city_btn.onclick = () => {
    let user_choice = prompt('Entrez votre ville');
    if (user_choice && user_choice.length && user_choice != city) {
        city = user_choice;
        let url = 'https://api.openweathermap.org/data/2.5/weather?' +
            `q=${city}&units=metric` + units_parameter + lang_parameter + api_key_parameter;
        update_temperature(url);
    }
}

// Set locate button click event
locate_city_btn.onclick = () => {
    update_from_location();
    locate_city_btn.blur();
}


// Retrieve city in localstorage if it exists
if (saved_city = localStorage.getItem('city')) {
    city = saved_city;
}


// fetch weather information on page load
let url = 'https://api.openweathermap.org/data/2.5/weather?' +
    `q=${city}&units=metric` + units_parameter + lang_parameter + api_key_parameter;
update_temperature(url);


function update_icon(icon_id) {
    let ICON_URL = `https://openweathermap.org/img/wn/${icon_id}@4x.png`;
    let weather_icon = document.querySelector('#weather-icon');
    weather_icon.setAttribute('src', ICON_URL);
}
