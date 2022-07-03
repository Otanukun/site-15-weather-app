const api = {
    key: '12062b6a411de0540088d03a4f133c6b',
    base: 'https://api.openweathermap.org/data/2.5/',
}

const notificationEl = document.querySelector('.notification');
const searchBox = document.querySelector('.search-box');

searchBox.addEventListener('keypress', setQuery);

function setQuery(e) {
    if (e.keyCode == 13) {
        getWeatherByCity(searchBox.value);
    }
}




async function getWeatherByCity(city) {
    try {
        const query = `${api.base}weather?q=${city}&units=metric&APPID=${api.key}`;
        const res = await fetch(query);
        // console.log("res", res);
        const weather = await res.json()
        console.log("weather", weather);
        displayResults(weather);
    } catch(err) {
        showError(err);
    }
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    showError('Browser doesn`t support Geolocation');
}

function setPosition(position) {
    let { latitude, longitude } = position.coords;
    getWeatherByGeo(latitude, longitude);
}

function showError(error) {
    console.log(error);
    //homework....//
    notificationEl.style.display = 'block';
    notificationEl.innerHTML = `<p>${error.massage}</p>`;
    setTimeout(() => {
        notificationEl.style.display = 'none';
    }, 5000)
}

async function getWeatherByGeo(latitude, longitude) {
    try {
        const query = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`;
        const res = await fetch(query);
        const weather = await res.json();
        displayResults(weather);
    } catch(error) {
        showError(error);
    }
}




function displayResults(weather) {
    const city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country ?  ', ' + weather.sys.country : ''} `;

    const now = new Date();
    const date = document.querySelector('.location .date');
    date.innerText = dateBuilding(now);

    const temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)} <span>°c</span>`;

    const weatherEl = document.querySelector('.current .weather');
    weatherEl.innerText = weather.weather[0].main;

    const hilow = document.querySelector('.current .hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_max)}°c / ${Math.round(weather.main.temp_min)}°c`;

}



function dateBuilding(d) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
}