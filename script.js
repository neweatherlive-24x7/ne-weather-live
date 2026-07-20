/*==================================================
                NE WEATHER LIVE
                SCRIPT.JS
                VERSION 3.0
==================================================*/

/*=========================================
            GLOBAL VARIABLES
=========================================*/

let currentFrame = 0;

let currentCityIndex = 0;

let weatherDatabase = {};

let forecastDatabase = {};

let airQualityDatabase = {};

let refreshTimer = null;

let frameTimer = null;

let tickerTimer = null;

let loadingFinished = false;

let weatherCanvas;

let weatherContext;

let canvasWidth;

let canvasHeight;

let cloudDensity = 0.5;

let targetCloudDensity = 0.5;

let cloudColor = "255,255,255";

let targetCloudColor = "255,255,255";

let rainParticles = [];

let rainEnabled = false;

let rainIntensity = 1;

let splashParticles = [];

let cloudParticles = [];

let lightningFlash = 0;

/*=========================================
            DOM ELEMENTS
=========================================*/

const frames = [];

let tickerElement;

let loadingScreen;

let clockElement;

let dateElement;

let analogHour;

let analogMinute;

let analogSecond;

/*=========================================
            APPLICATION START
=========================================*/

/*=========================================
            INITIALIZE APP
=========================================*/

async function initApp() {

    console.log(
        `${CONFIG.APP_NAME} v${CONFIG.VERSION}`
    );

cacheElements();

initWeatherCanvas();

startClock();


updateBackgroundTheme();

setInterval(updateBackgroundTheme, 60000);

await loadAllWeather();

startFrameRotation();

startTicker();

startRefreshCountdown();

hideLoadingScreen();

}

/*=========================================
            CACHE ELEMENTS
=========================================*/

function cacheElements() {

    CONFIG.FRAMES.forEach(id => {

        const frame = document.getElementById(id);

        if(frame){

            frames.push(frame);

        }

    });

    tickerElement =
        document.getElementById("ticker");

    loadingScreen =
        document.getElementById("loading-screen");

    clockElement =
        document.getElementById("clock");

    dateElement =
        document.getElementById("date");

    analogHour =
        document.querySelector(".hour-hand");

    analogMinute =
        document.querySelector(".minute-hand");

    analogSecond =
        document.querySelector(".second-hand");

}

/*=========================================
            LOADING SCREEN
=========================================*/

function hideLoadingScreen(){

    if(!loadingScreen) return;

    loadingScreen.style.opacity = "0";

  setTimeout(()=>{

    loadingScreen.style.display = "none";

    loadingFinished = true;

},5000);

}
/*==================================================
            OPEN-METEO API
==================================================*/

/*=========================================
        LOAD ALL WEATHER DATA
=========================================*/

async function loadAllWeather() {

    try {

        const promises = CONFIG.CITIES.map(city =>
            loadCityWeather(city)
        );

        await Promise.all(promises);

        updateFeaturedCity();

        updateStateOverview();

        updateCityCards();

        updateForecast();

        updateAQI();

        console.log("Weather data loaded.");

    } catch (error) {

        console.error(
            "Weather loading failed:",
            error
        );

    }

}

/*=========================================
        LOAD SINGLE CITY
=========================================*/

async function loadCityWeather(city) {

    try {

        const weather = await fetchWeather(city);

        const air = await fetchAirQuality(city);

        weatherDatabase[city.name] = weather;

        forecastDatabase[city.name] =
            weather.daily;

        airQualityDatabase[city.name] = air;

    } catch (error) {

        console.error(
            `Error loading ${city.name}`,
            error
        );

    }

}

/*=========================================
            FETCH WEATHER
=========================================*/

async function fetchWeather(city) {

    const url =
        `${CONFIG.API.WEATHER}?` +

        `latitude=${city.latitude}` +

        `&longitude=${city.longitude}` +

        `&current=${CONFIG.WEATHER_PARAMS}` +

        `&daily=${CONFIG.DAILY_PARAMS}` +

        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Weather request failed"
        );

    }

    return await response.json();

}

/*=========================================
        FETCH AIR QUALITY
=========================================*/

async function fetchAirQuality(city) {

    const url =
        `${CONFIG.API.AIR_QUALITY}?` +

        `latitude=${city.latitude}` +

        `&longitude=${city.longitude}` +

        `&hourly=${CONFIG.AIR_PARAMS}` +

        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "AQI request failed"
        );

    }

    return await response.json();

}

/*=========================================
        AUTO REFRESH WEATHER
=========================================*/

function startWeatherRefresh() {

    if (refreshTimer) {

        clearInterval(refreshTimer);

    }

    refreshTimer = setInterval(async () => {

        console.log("Refreshing weather...");

        await loadAllWeather();

    }, CONFIG.REFRESH_INTERVAL);

}

/*=========================================
        GET WEATHER INFO
=========================================*/

function getWeatherInfo(code) {

    return CONFIG.WEATHER_CODES[code] || {

        text: "Unknown",

        icon: "❓"

    };

}

/*=========================================
        GET AQI LEVEL
=========================================*/

function getAQILevel(value) {

    for (const level of CONFIG.AQI_LEVELS) {

        if (
            value >= level.min &&
            value <= level.max
        ) {

            return level;

        }

    }

    return CONFIG.AQI_LEVELS[0];

}

/*=========================================
        GET TEMPERATURE CLASS
=========================================*/

function getTemperatureClass(temp) {

    for (const item of CONFIG.TEMP_CLASSES) {

        if (temp <= item.max) {

            return item.class;

        }

    }

    return "temp-hot";

}

/*=========================================
        WIND DIRECTION
=========================================*/

function getWindDirection(degrees) {

    const index =
        Math.round(degrees / 22.5) % 16;

    return CONFIG.WIND_DIRECTIONS[index];

}

/*==================================================
            WEATHER ENGINE
==================================================*/

function initWeatherCanvas(){

    weatherCanvas = document.getElementById("weather-canvas");

    console.log("Canvas:", weatherCanvas);

    if(!weatherCanvas) return;

    weatherContext = weatherCanvas.getContext("2d");

    console.log("Context:", weatherContext);

resizeWeatherCanvas();

createCloudParticles();



createRainParticles();

window.addEventListener(
    "resize",
    resizeWeatherCanvas
);

    requestAnimationFrame(weatherLoop);

}

function resizeWeatherCanvas(){

    canvasWidth = weatherCanvas.width = weatherCanvas.offsetWidth;

    canvasHeight = weatherCanvas.height = weatherCanvas.offsetHeight;

    createCloudParticles();

}

function createCloudParticles(){

    cloudParticles = [];

const layers = [

    {count:5,speed:0.35,opacity:0.15,scale:1.8},

    {count:7,speed:0.65,opacity:0.24,scale:1.2},

    {count:5,speed:1.00,opacity:0.30,scale:0.9}

];

    layers.forEach(layer=>{

        for(let i=0;i<layer.count;i++){

            const blobs=[];

            const blobCount=5+Math.floor(Math.random()*4);

            for(let j=0;j<blobCount;j++){

                blobs.push({

                    x:(Math.random()-0.5)*180,

                    y:(Math.random()-0.5)*60,

                    r:45+Math.random()*40

                });

            }

            cloudParticles.push({

                x:Math.random()*canvasWidth,

                y:40+Math.random()*canvasHeight*0.35,

                speed:layer.speed,

                opacity:layer.opacity,

                scale:layer.scale,

                blobs

            });

        }

    });

}

function createRainParticles(){

    rainParticles = [];

    for(let i = 0; i < 500; i++){

        rainParticles.push({

            x: Math.random() * canvasWidth,

            y: Math.random() * canvasHeight,

            length: 10 + Math.random() * 18,

            speed: 12 + Math.random() * 10

        });

    }

}

function createSplash(x, y){

    splashParticles.push({

        x,

        y,

        radius: 1,

        alpha: 0.5,

        life: 12

    });

}


function weatherLoop(){

    weatherContext.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


drawClouds();

if(rainEnabled){

    drawRain();

}

drawSplashes();

cloudDensity +=
    (targetCloudDensity - cloudDensity) * 0.02;

if(cloudColor !== targetCloudColor){

    cloudColor = targetCloudColor;

}

if(lightningFlash > 0){

    weatherContext.fillStyle =
        `rgba(255,255,255,${lightningFlash})`;

    weatherContext.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    lightningFlash *= 0.88;

    if(lightningFlash < 0.01){

        lightningFlash = 0;

    }

}


    requestAnimationFrame(weatherLoop);

}

function drawClouds(){

    weatherContext.save();

    weatherContext.filter = "blur(8px)";

    cloudParticles.forEach(cloud=>{

        cloud.blobs.forEach(blob=>{

            const x = cloud.x + blob.x;

            const y = cloud.y + blob.y;

            const r = blob.r * cloud.scale;

            const gradient =
                weatherContext.createRadialGradient(
                    x,
                    y,
                    r * 0.2,
                    x,
                    y,
                    r
                );

            gradient.addColorStop(
                0,
                `rgba(${cloudColor},${0.95 * cloud.opacity * cloudDensity})`
            );

            gradient.addColorStop(
                0.55,
                `rgba(${cloudColor},${0.55 * cloud.opacity * cloudDensity})`
            );

            gradient.addColorStop(
                1,
                `rgba(${cloudColor},0)`
            );

            weatherContext.fillStyle = gradient;

            weatherContext.beginPath();

            weatherContext.arc(
                x,
                y,
                r,
                0,
                Math.PI * 2
            );

            weatherContext.fill();

        });

        cloud.x += cloud.speed * 3;

        if(cloud.x > canvasWidth + 250){

            cloud.x = -250;

            cloud.y = 40 + Math.random() * canvasHeight * 0.35;

        }

    });

    weatherContext.restore();

}

function drawRain(){

    weatherContext.save();

    weatherContext.strokeStyle =
        "rgba(190,225,255,0.55)";

    weatherContext.lineWidth = 1.2;

    weatherContext.lineCap = "round";

    const activeDrops =
        Math.floor(rainParticles.length * rainIntensity);

    for(let i = 0; i < activeDrops; i++){

        const drop = rainParticles[i];

        const wind =
            3 + (rainIntensity * 5);

        const speed =
            drop.speed * (0.8 + rainIntensity);

        const length =
            drop.length * (0.7 + rainIntensity);

        weatherContext.beginPath();

        weatherContext.moveTo(
            drop.x,
            drop.y
        );

        weatherContext.lineTo(
            drop.x - wind,
            drop.y + length
        );

        weatherContext.stroke();

        drop.x -= wind * 0.35;

        drop.y += speed;

if(drop.y > canvasHeight + 20){

    createSplash(
        drop.x,
        canvasHeight - 2
    );

    drop.y = -20;

    drop.x =
        Math.random() * canvasWidth;

}

    }

    weatherContext.restore();

}

/*==================================================
            CURRENT WEATHER
==================================================*/

function drawSplashes(){

    weatherContext.save();

    for(let i = splashParticles.length - 1; i >= 0; i--){

        const splash = splashParticles[i];

        weatherContext.beginPath();

        weatherContext.fillStyle =
            `rgba(220,240,255,${splash.alpha})`;

        weatherContext.arc(
            splash.x,
            splash.y,
            splash.radius,
            0,
            Math.PI * 2
        );

        weatherContext.fill();

        splash.radius += 0.25;

        splash.alpha -= 0.04;

        splash.life--;

        if(splash.life <= 0){

            splashParticles.splice(i,1);

        }

    }

    weatherContext.restore();

}

/*=========================================
        UPDATE FEATURED CITY
=========================================*/

function updateFeaturedCity() {

    const city = CONFIG.CITIES[currentCityIndex];

    const data = weatherDatabase[city.name];

    if (!data || !data.current) return;

    const current = data.current;

    const weather = getWeatherInfo(current.weather_code);

    // Main City Information
setText("city-name", city.name);
setText("city-state", city.state);
setText("city-icon", weather.icon);
setText("city-temperature", `${Math.round(current.temperature_2m)}°`);
setText("city-condition", weather.text);

// Header
setText("header-city", `${city.name}, ${city.state}`);
setText("header-temp", `${Math.round(current.temperature_2m)}°C`);
setText("header-humidity", `${current.relative_humidity_2m}%`);
setText("header-wind", `${Math.round(current.wind_speed_10m)} km/h`);
setText("header-update", "Just Now");

// Weather Details
setText("city-feels", `${Math.round(current.apparent_temperature)}°`);
setText("city-humidity", `${current.relative_humidity_2m}%`);
setText("city-wind", `${Math.round(current.wind_speed_10m)} km/h ${getWindDirection(current.wind_direction_10m)}`);
setText("city-pressure", `${Math.round(current.pressure_msl)} hPa`);
setText("city-visibility", `${Math.round(current.visibility / 1000)} km`);

const air = airQualityDatabase[city.name];

if (air && air.hourly) {
    setText("header-aqi", `AQI ${Math.round(air.hourly.us_aqi[0])}`);
}

const daily = data.daily;

if (daily) {
    setText("city-sunrise", formatTime(daily.sunrise[0]));
    setText("city-sunset", formatTime(daily.sunset[0]));
}

setText(
    "city-uv",
    current.uv_index !== undefined
        ? current.uv_index.toFixed(1)
        : "--"
);

applyTemperatureColour(current.temperature_2m);
updateWeatherEffects(
    current.weather_code,
    current.is_day
);
currentCityIndex++;

if (currentCityIndex >= CONFIG.CITIES.length) {
    currentCityIndex = 0;
}
}

/*=========================================
        WEATHER SUMMARY
=========================================*/

function updateWeatherSummary(code) {

    let message;

    switch (code) {

        case 0:
            message = "Clear skies with excellent visibility across the area.";
            break;

        case 1:
        case 2:
        case 3:
            message = "Partly cloudy conditions with pleasant weather.";
            break;

        case 45:
        case 48:
            message = "Foggy conditions. Drive carefully and use low-beam headlights.";
            break;

        case 51:
        case 53:
        case 55:
        case 61:
        case 63:
        case 65:
            message = "Rain expected. Carry an umbrella and allow extra travel time.";
            break;

        case 71:
        case 73:
        case 75:
            message = "Snowfall expected in higher elevations.";
            break;

        case 95:
        case 96:
        case 99:
            message = "Thunderstorm activity possible. Stay indoors if lightning develops.";
            break;

        default:
            message = "Weather conditions are stable across the region.";

    }

    setText("weather-summary", message);

}

/*=========================================
        TEMPERATURE COLOUR
=========================================*/

function applyTemperatureColour(temp) {

    const element = document.getElementById("city-temperature");

    if (!element) return;

    element.className = "";

    element.classList.add(
        getTemperatureClass(temp)
    );

}
/*==================================================
            NORTH EAST OVERVIEW
==================================================*/

/*=========================================
        UPDATE STATE OVERVIEW
=========================================*/

function updateStateOverview() {

    CONFIG.STATES.forEach(state => {

        const city = CONFIG.CITIES.find(
            c => c.name === state.displayCity
        );

        if (!city) return;

        const data = weatherDatabase[city.name];

        if (!data || !data.current) return;

        const current = data.current;

        const weather = getWeatherInfo(
            current.weather_code
        );

        const key = state.name
            .toLowerCase()
            .replace(/\s+/g, "-");

        setText(
            `temp-${key}`,
            `${Math.round(current.temperature_2m)}°`
        );

        setText(
            `condition-${key}`,
            weather.text
        );

        setText(
            `icon-${key}`,
            weather.icon
        );

    });

    updateRegionalSummary();

}

/*=========================================
        REGIONAL SUMMARY
=========================================*/

function updateRegionalSummary() {

    let warmest = null;

    let coolest = null;

    let total = 0;

    let count = 0;

    CONFIG.STATES.forEach(state => {

        const city = CONFIG.CITIES.find(
            c => c.name === state.displayCity
        );

        if (!city) return;

        const data = weatherDatabase[city.name];

        if (!data || !data.current) return;

        const temp = data.current.temperature_2m;

        total += temp;

        count++;

        if (!warmest || temp > warmest.temp) {

            warmest = {

                name: state.name,

                temp

            };

        }

        if (!coolest || temp < coolest.temp) {

            coolest = {

                name: state.name,

                temp

            };

        }

    });

    if (warmest) {

        setText(
            "warmest-state",
            `${warmest.name} (${Math.round(warmest.temp)}°)`
        );

    }

    if (coolest) {

        setText(
            "coolest-state",
            `${coolest.name} (${Math.round(coolest.temp)}°)`
        );

    }

    if (count > 0) {

        setText(
            "regional-average",
            `${Math.round(total / count)}°`
        );

    }

}

/*=========================================
        UPDATE CONNECTION STATUS
=========================================*/

function updateConnectionStatus(isOnline = true) {

    const dot = document.getElementById(
        "connection-dot"
    );

    const text = document.getElementById(
        "connection-text"
    );

    if (!dot || !text) return;

    if (isOnline) {

        dot.style.background = "#00ff55";

        text.textContent = "CONNECTED";

    } else {

        dot.style.background = "#ff3b30";

        text.textContent = "OFFLINE";

    }

}
/*==================================================
                MAJOR CITIES
==================================================*/

/*=========================================
            UPDATE CITY CARDS
=========================================*/

function updateCityCards() {

    CONFIG.CITIES.forEach(city => {

        const data = weatherDatabase[city.name];

        if (!data || !data.current) return;

        const current = data.current;

        const weather = getWeatherInfo(
            current.weather_code
        );

        const cityId = city.name
            .toLowerCase()
            .replace(/\s+/g, "-");

        setText(
            `temp-${cityId}`,
            `${Math.round(current.temperature_2m)}°`
        );

        setText(
            `condition-${cityId}`,
            weather.text
        );

        setText(
            `icon-${cityId}`,
            weather.icon
        );
setText(
    `humidity-${cityId}`,
    `${current.relative_humidity_2m}%`
);

setText(
    `wind-${cityId}`,
    `${Math.round(current.wind_speed_10m)} km/h`
);

        applyCityTemperatureColour(
            cityId,
            current.temperature_2m
        );

    });

}

/*=========================================
        CITY TEMPERATURE COLOUR
=========================================*/

function applyCityTemperatureColour(
    cityId,
    temperature
){

    const element =
        document.getElementById(
            `temp-${cityId}`
        );

    if(!element) return;

    element.className = "city-temp";

    element.classList.add(
        getTemperatureClass(
            temperature
        )
    );

}

/*=========================================
        HIGHLIGHT FEATURED CITY
=========================================*/

function highlightFeaturedCity(){

    document
        .querySelectorAll(".city-card")
        .forEach(card=>{

            card.classList.remove(
                "featured-city-card"
            );

        });

    const featured =
        CONFIG.CITIES.find(
            c=>c.featured
        );

    if(!featured) return;

    const id =
        featured.name
        .toLowerCase()
        .replace(/\s+/g,"-");

    const card =
        document.getElementById(
            `city-${id}`
        );

    if(card){

        card.classList.add(
            "featured-city-card"
        );

    }

}

/*=========================================
        UPDATE LAST REFRESH
=========================================*/

function updateLastRefresh(){

    const element =
        document.getElementById(
            "last-updated"
        );

    if(!element) return;

    element.textContent =
        new Date()
        .toLocaleTimeString(
            "en-IN",
            {

                hour:"2-digit",

                minute:"2-digit",

                second:"2-digit"

            }

        );

}

/*=========================================
        REFRESH COUNTDOWN
=========================================*/

function startRefreshCountdown(){

    let remaining = 600;

    const counter =
        document.getElementById(
            "refresh-countdown"
        );

    setInterval(()=>{

        const minutes =
            Math.floor(
                remaining/60
            );

        const seconds =
            remaining%60;

        if(counter){

            counter.textContent =

                `${String(minutes)
                .padStart(2,"0")}:${String(seconds)
                .padStart(2,"0")}`;

        }

        remaining--;

        if(remaining<0){

            remaining=600;

        }

    },1000);

}
/*==================================================
                7-DAY FORECAST
==================================================*/

/*=========================================
            UPDATE FORECAST
=========================================*/

function updateForecast() {

    CONFIG.STATES.forEach(state => {

        const city = CONFIG.CITIES.find(
            c => c.name === state.displayCity
        );

        if (!city) return;

        const forecast = forecastDatabase[city.name];

        if (!forecast) return;

        const card = document.getElementById(
            `forecast-${state.name.toLowerCase().replace(/\s+/g,"-")}`
        );

        if (!card) return;

        const weather = getWeatherInfo(
            forecast.weather_code[0]
        );

        const high = Math.round(
            forecast.temperature_2m_max[0]
        );

        const low = Math.round(
            forecast.temperature_2m_min[0]
        );

        const day = new Date(forecast.time[0])
            .toLocaleDateString("en-IN", {
                weekday: "short"
            });

        card.innerHTML = `
            <div class="forecast-state">${state.name}</div>

            <div class="forecast-day">${day}</div>

            <div class="forecast-icon">${weather.icon}</div>

            <div class="forecast-condition">
                ${weather.text}
            </div>

            <div class="forecast-temp">
                ${high}° / ${low}°
            </div>
        `;

        card.classList.add("fade-in");

    });

}

/*=========================================
        FORECAST ANIMATION
=========================================*/

function animateForecastCards() {

    const cards =
        document.querySelectorAll(
            ".forecast-card"
        );

    cards.forEach((card, index) => {

        setTimeout(() => {

            card.classList.remove(
                "fade-in"
            );

            void card.offsetWidth;

            card.classList.add(
                "fade-in"
            );

        }, index * 120);

    });

}

/*=========================================
        FORECAST REFRESH
=========================================*/

function refreshForecast() {

    updateForecast();

    animateForecastCards();

}
/*==================================================
                    AIR QUALITY
==================================================*/

/*=========================================
                UPDATE AQI
=========================================*/

function updateAQI() {

    CONFIG.STATES.forEach(state => {

        const city = CONFIG.CITIES.find(
            c => c.name === state.displayCity
        );

        if (!city) return;

        const data = airQualityDatabase[city.name];

        if (!data || !data.hourly) return;

        const aqi = Math.round(data.hourly.us_aqi?.[0] ?? 0);

        const pm25 = data.hourly.pm2_5?.[0] ?? 0;

        const pm10 = data.hourly.pm10?.[0] ?? 0;

        const level = getAQILevel(aqi);

        const id = state.name
            .toLowerCase()
            .replace(/\s+/g, "-");

        const card = document.getElementById(`aqi-${id}`);

        if (!card) return;

        card.innerHTML = `
            <div class="aqi-state">${state.name}</div>

            <div class="aqi-circle ${level.class}">
                ${aqi}
            </div>

            <div class="aqi-status">${level.label}</div>

            <div class="aqi-extra">
                PM2.5 : ${pm25.toFixed(1)} µg/m³<br>
                PM10 : ${pm10.toFixed(1)} µg/m³
            </div>
        `;

    });
}

/*=========================================
            AQI STYLE
=========================================*/

function updateAQIStyle(cssClass) {

    const circle =
        document.getElementById(
            "aqi-circle"
        );

    if (!circle) return;

    circle.classList.remove(
        "aqi-good",
        "aqi-moderate",
        "aqi-sensitive",
        "aqi-poor",
        "aqi-hazardous"
    );

    circle.classList.add(cssClass);

}

/*=========================================
            AQI ADVICE
=========================================*/

function getAQIAdvice(level) {

    switch(level){

        case "Good":

            return "Air quality is excellent. Outdoor activities are safe.";

        case "Moderate":

            return "Air quality is acceptable for most people.";

        case "Unhealthy for Sensitive Groups":

            return "Children, elderly and people with respiratory illness should reduce prolonged outdoor activity.";

        case "Unhealthy":

            return "Limit outdoor activities. Consider wearing a mask if necessary.";

        case "Very Unhealthy":

            return "Avoid prolonged outdoor exposure whenever possible.";

        case "Hazardous":

            return "Stay indoors. Keep windows closed and avoid unnecessary travel.";

        default:

            return "Air quality information unavailable.";

    }

}

/*=========================================
            AQI AUTO REFRESH
=========================================*/

function refreshAQI() {
    updateAQI();
}

/*==================================================
                CLOCK & DATE
==================================================*/

/*=========================================
            START CLOCK
=========================================*/

function startClock() {

    updateClock();

    setInterval(updateClock, 1000);

}

/*=========================================
            UPDATE CLOCK
=========================================*/

function updateClock() {

    const now = new Date();

    updateDigitalClock(now);

    updateDate(now);

    updateAnalogClock(now);

}

/*=========================================
        DIGITAL CLOCK
=========================================*/

function updateDigitalClock(now) {

    if (!clockElement) return;

    const time = now.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );

    clockElement.textContent = time;

}

/*=========================================
                DATE
=========================================*/

function updateDate(now) {

    if (!dateElement) return;

    const date = now.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    dateElement.textContent = date;

}

/*=========================================
            ANALOG CLOCK
=========================================*/

function updateAnalogClock(now) {

    if (
        !analogHour ||
        !analogMinute ||
        !analogSecond
    ) {
        return;
    }

    const seconds = now.getSeconds();

    const minutes =
        now.getMinutes() +
        seconds / 60;

    const hours =
        (now.getHours() % 12) +
        minutes / 60;

    const secondDeg =
        seconds * 6;

    const minuteDeg =
        minutes * 6;

    const hourDeg =
        hours * 30;

    analogSecond.style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;

    analogMinute.style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;

    analogHour.style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;

}

/*=========================================
        OPTIONAL TIMEZONE LABEL
=========================================*/

function updateTimezone() {

    const timezone =
        document.getElementById(
            "timezone"
        );

    if (!timezone) return;

    timezone.textContent =
        "Indian Standard Time (IST)";

}

/*=========================================
        CLOCK GLOW EFFECT
=========================================*/

function animateClock() {

    if (!clockElement) return;

    clockElement.classList.add(
        "clock-glow"
    );

    setTimeout(() => {

        clockElement.classList.remove(
            "clock-glow"
        );

    }, 500);

}

setInterval(animateClock, 60000);
/*==================================================
            FRAME ROTATION SYSTEM
==================================================*/

/*=========================================
            START ROTATION
=========================================*/

function startFrameRotation() {

    showFrame(0);

    if (frameTimer) {

        clearInterval(frameTimer);

    }

    frameTimer = setInterval(() => {

        currentFrame++;

        if (currentFrame >= frames.length) {

            currentFrame = 0;

        }

        showFrame(currentFrame);

    }, CONFIG.FRAME_DURATION);

}

/*=========================================
                SHOW FRAME
=========================================*/

function showFrame(index) {

    if (!frames.length) return;

    frames.forEach(frame => {
        frame.classList.remove("active");
        frame.classList.add("hidden");
    });

    const active = frames[index];

    if (!active) return;

    active.classList.remove("hidden");
    active.classList.add("active");

    updateFrameTitle(index);
}

/*=========================================
            FRAME TITLE
=========================================*/

function updateFrameTitle(index) {

    const title =
        document.getElementById(
            "frame-title"
        );

    if (!title) return;

const names = [

    "CURRENT WEATHER",

    "NORTH EAST OVERVIEW",

    "MAJOR CITIES (1–8)",

    "MAJOR CITIES (9–16)",

    "MAJOR CITIES (17–24)",

    "MAJOR CITIES (25–29)",

    "7 DAY FORECAST",

    "AIR QUALITY INDEX",

    "WEATHER ALERTS"

];

    title.textContent =
        names[index] || "NE WEATHER LIVE";

}

/*=========================================
        NEXT FRAME
=========================================*/

function nextFrame() {

    currentFrame++;

    if (currentFrame >= frames.length) {

        currentFrame = 0;

    }

    showFrame(currentFrame);

}

/*=========================================
        PREVIOUS FRAME
=========================================*/

function previousFrame() {

    currentFrame--;

    if (currentFrame < 0) {

        currentFrame =
            frames.length - 1;

    }

    showFrame(currentFrame);

}

/*=========================================
        GO TO FRAME
=========================================*/

function goToFrame(index) {

    if (
        index < 0 ||
        index >= frames.length
    ) {
        return;
    }

    currentFrame = index;

    showFrame(index);

}

/*=========================================
        PAUSE ROTATION
=========================================*/

function pauseRotation() {

    if (frameTimer) {

        clearInterval(frameTimer);

        frameTimer = null;

    }

}

/*=========================================
        RESUME ROTATION
=========================================*/

function resumeRotation() {

    if (frameTimer) return;

    frameTimer = setInterval(() => {

        nextFrame();

    }, CONFIG.FRAME_DURATION);

}

/*=========================================
        KEYBOARD SHORTCUTS
=========================================*/

document.addEventListener(
    "keydown",
    event => {

        switch (event.key) {

            case "ArrowRight":

                pauseRotation();

                nextFrame();

                break;

            case "ArrowLeft":

                pauseRotation();

                previousFrame();

                break;

            case " ":

                if (frameTimer) {

                    pauseRotation();

                } else {

                    resumeRotation();

                }

                break;

        }

    }
);
/*==================================================
                LIVE TICKER
==================================================*/

/*=========================================
            START TICKER
=========================================*/

function startTicker() {

    updateTicker();

    if (tickerTimer) {

        clearInterval(tickerTimer);

    }

    tickerTimer = setInterval(() => {

        updateTicker();

    }, CONFIG.TICKER_INTERVAL);

}

/*=========================================
            UPDATE TICKER
=========================================*/

function updateTicker() {

    if (!tickerElement) return;

    const messages = [];

    /* Featured City */

    const featured =
        CONFIG.CITIES.find(c => c.featured) ||
        CONFIG.CITIES[0];

    const weather =
        weatherDatabase[featured.name];

    if (weather && weather.current) {

        const current = weather.current;

        const info =
            getWeatherInfo(
                current.weather_code
            );

        messages.push(

            `📍 ${featured.name}: ${Math.round(current.temperature_2m)}°C • ${info.text}`

        );

    }

    /* Warmest State */

    let hottest = null;

    CONFIG.STATES.forEach(state => {

        const city =
            CONFIG.CITIES.find(
                c => c.name === state.displayCity
            );

        if (!city) return;

        const data =
            weatherDatabase[city.name];

        if (!data) return;

        const temp =
            data.current.temperature_2m;

        if (!hottest || temp > hottest.temp) {

            hottest = {

                state: state.name,

                temp

            };

        }

    });

    if (hottest) {

        messages.push(

            `🔥 Warmest: ${hottest.state} (${Math.round(hottest.temp)}°C)`

        );

    }

    /* AQI */

    const air =
        airQualityDatabase[featured.name];

    if (air && air.hourly) {

        const value =
            air.hourly.us_aqi?.[0] ?? 0;

        const level =
            getAQILevel(value);

        messages.push(

            `🌿 AQI ${Math.round(value)} (${level.label})`

        );

    }

    /* Random Weather Tip */

    const tips =
        CONFIG.WEATHER_TIPS ||
        CONFIG.TIPS ||
        [];

    if (tips.length > 0) {

        const random =
            tips[
                Math.floor(
                    Math.random() *
                    tips.length
                )
            ];

        messages.push(

            `💡 ${random}`

        );

    }

    /* Footer */

    messages.push(
    CONFIG.TICKER_MESSAGES[
        Math.floor(Math.random() * CONFIG.TICKER_MESSAGES.length)
    ]
);

    if (messages.length === 0) {
    messages.push("📡 NE Weather Live • Loading latest weather updates...");
}

tickerElement.innerHTML =
    `<span>${messages.join(" &nbsp;&nbsp;&nbsp; ● &nbsp;&nbsp;&nbsp; ")}</span>`;

restartTickerAnimation();

}

/*=========================================
        TICKER ANIMATION RESET
=========================================*/

function restartTickerAnimation() {

    if (!tickerElement) return;

    const span = tickerElement.querySelector("span");

if (!span) return;

span.style.animation = "none";
void span.offsetWidth;
span.style.animation = "tickerMove 60s linear infinite";

}

/*=========================================
        MANUAL TICKER MESSAGE
=========================================*/

function setTickerMessage(message) {

    if (!tickerElement) return;

    tickerElement.innerHTML = message;

    restartTickerAnimation();

}

/*=========================================
        LIVE BREAKING NEWS
=========================================*/

function showBreakingTicker(message) {

    if (!tickerElement) return;

    tickerElement.innerHTML =

        `🚨 BREAKING: ${message}`;

    restartTickerAnimation();

    setTimeout(() => {

        updateTicker();

    }, 15000);

}
/*==================================================
                WEATHER ALERTS
==================================================*/

/*=========================================
            UPDATE ALERTS
=========================================*/

function updateWeatherAlerts() {

    const featured =
        CONFIG.CITIES.find(city => city.featured) ||
        CONFIG.CITIES[0];

    const data =
        weatherDatabase[featured.name];

    if (!data || !data.current) return;

    const current = data.current;

    const alerts = [];

    /* Thunderstorm */

    if ([95, 96, 99].includes(current.weather_code)) {

        alerts.push({
            icon: "⛈️",
            title: "Thunderstorm Warning",
            message: "Lightning and thunderstorms are expected. Stay indoors and avoid open areas."
        });

    }

    /* Heavy Rain */

    if ([63, 65, 80, 81, 82].includes(current.weather_code)) {

        alerts.push({
            icon: "🌧️",
            title: "Heavy Rain Alert",
            message: "Heavy rainfall may cause waterlogging and reduced visibility."
        });

    }

    /* Snow */

    if ([71, 73, 75, 77].includes(current.weather_code)) {

        alerts.push({
            icon: "❄️",
            title: "Snowfall Alert",
            message: "Snowfall is expected in higher altitude areas."
        });

    }

    /* Fog */

    if ([45, 48].includes(current.weather_code)) {

        alerts.push({
            icon: "🌫️",
            title: "Dense Fog",
            message: "Visibility is poor. Drive carefully using low-beam headlights."
        });

    }

    /* Heat */

    if (current.temperature_2m >= 35) {

        alerts.push({
            icon: "🔥",
            title: "Heat Alert",
            message: "Stay hydrated and avoid prolonged exposure to direct sunlight."
        });

    }

    /* Cold */

    if (current.temperature_2m <= 5) {

        alerts.push({
            icon: "🥶",
            title: "Cold Wave",
            message: "Wear warm clothing and protect children and elderly people."
        });

    }

    /* Strong Wind */

    if (current.wind_speed_10m >= 40) {

        alerts.push({
            icon: "💨",
            title: "Strong Wind",
            message: "Secure loose objects and avoid unnecessary travel."
        });

    }

    displayAlerts(alerts);

}

/*=========================================
            DISPLAY ALERTS
=========================================*/

function displayAlerts(alerts) {

    const container =
        document.getElementById(
            "alerts-container"
        );

    if (!container) return;

    container.innerHTML = "";

    if (alerts.length === 0) {

        container.innerHTML = `

            <div class="alert-card safe">

                <div class="alert-icon">✅</div>

                <div class="alert-title">
                    No Active Weather Alerts
                </div>

                <div class="alert-message">
                    Weather conditions are currently stable across the featured location.
                </div>

            </div>

        `;

        return;

    }

    alerts.forEach(alert => {

        const card =
            document.createElement("div");

        card.className = "alert-card danger";

        card.innerHTML = `

            <div class="alert-icon">
                ${alert.icon}
            </div>

            <div class="alert-title">
                ${alert.title}
            </div>

            <div class="alert-message">
                ${alert.message}
            </div>

        `;

        container.appendChild(card);

    });

}

/*=========================================
        BREAKING WEATHER ALERT
=========================================*/

function showBreakingAlert(message) {

    displayAlerts([{

        icon: "🚨",

        title: "Breaking Weather Alert",

        message: message

    }]);

    showBreakingTicker(message);

}

/*=========================================
        ALERT AUTO REFRESH
=========================================*/

function refreshAlerts() {

    updateWeatherAlerts();

}
/*==================================================
        HELPER FUNCTIONS & APP STARTUP
==================================================*/

/*=========================================
            SET TEXT
=========================================*/

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}

/*=========================================
            FORMAT TIME
=========================================*/

function formatTime(timeString) {

    if (!timeString) return "--:--";

    return new Date(timeString).toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );

}

/*=========================================
            NETWORK STATUS
=========================================*/

window.addEventListener("online", () => {

    updateConnectionStatus(true);

});

window.addEventListener("offline", () => {

    updateConnectionStatus(false);

});

/*=========================================
        PERIODIC REFRESH
=========================================*/

function startAutoRefresh() {

    startWeatherRefresh();

    setInterval(async () => {

        try {

            await loadAllWeather();

            updateFeaturedCity();

            updateStateOverview();

            updateCityCards();

            updateForecast();

            updateAQI();

            updateWeatherAlerts();

            //updateTicker();

            updateLastRefresh();

            console.log("Weather refreshed.");

        }

        catch (error) {

            console.error(error);

        }

    }, CONFIG.REFRESH_INTERVAL);

}

/*=========================================
            ERROR HANDLER
=========================================*/

window.addEventListener("error", event => {

    console.error(
        "Application Error:",
        event.message
    );

});

/*=========================================
        UNHANDLED PROMISES
=========================================*/

window.addEventListener(

    "unhandledrejection",

    event => {

        console.error(
            "Promise Error:",
            event.reason
        );

    }

);

/*=========================================
        START APPLICATION
=========================================*/
function updateBackgroundTheme() {

    const hour = new Date().getHours();

    const sky = document.getElementById("sky-gradient");
    const sun = document.getElementById("sun");
    const moon = document.getElementById("moon");

    if (!sky || !sun || !moon) return;

    if (hour >= 5 && hour < 7) {

        sky.style.background = "linear-gradient(180deg,#ffb36b 0%,#ff8f5a 45%,#5da9ff 100%)";
        sun.style.opacity = "1";
        moon.style.opacity = "0";

    } else if (hour >= 7 && hour < 17) {

        sky.style.background = "linear-gradient(180deg,#0b2b53 0%,#144b8b 45%,#1b6db8 100%)";
        sun.style.opacity = "1";
        moon.style.opacity = "0";

    } else if (hour >= 17 && hour < 19) {

        sky.style.background = "linear-gradient(180deg,#45225d 0%,#ff6d3d 50%,#ffb067 100%)";
        sun.style.opacity = "1";
        moon.style.opacity = "0";

    } else {

        sky.style.background = "linear-gradient(180deg,#020816 0%,#07162f 45%,#0b2347 100%)";
        sun.style.opacity = "0";
        moon.style.opacity = "1";

    }

}

function updateWeatherEffects(weatherCode, isDay){

const lightning = document.getElementById("lightning");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const sky = document.getElementById("sky-gradient");

if(!lightning || !sun || !moon || !sky) return;



rainEnabled = false;


if([51,53,55].includes(weatherCode)){

    rainEnabled = true;

    rainIntensity = 0.30;

}

else if([61,63].includes(weatherCode)){

    rainEnabled = true;

    rainIntensity = 0.60;

}

else if([65,80,81].includes(weatherCode)){

    rainEnabled = true;

    rainIntensity = 0.85;

}

else if([82].includes(weatherCode)){

    rainEnabled = true;

    rainIntensity = 1.00;

}
// Snow animation will be added later

// Fog animation will be added later

    if([95,96,99].includes(weatherCode)){

        rainEnabled = true;

        rainIntensity = 1;

        lightning.animate(
            [
                {opacity:0},
                {opacity:1},
                {opacity:0},
                {opacity:.7},
                {opacity:0}
            ],
            {
                duration:700
            }
        );

    }
/*=========================================
        CLOUD DENSITY
=========================================*/

if(weatherCode === 0){

    targetCloudDensity = 0.10;
    targetCloudColor = isDay ? "255,255,255" : "210,225,255";

}
else if([1,2].includes(weatherCode)){

    targetCloudDensity = 0.30;
    targetCloudColor = isDay ? "245,245,245" : "200,215,240";

}
else if(weatherCode === 3){

    targetCloudDensity = 0.60;
    targetCloudColor = "225,225,225";

}
else if([45,48].includes(weatherCode)){

    targetCloudDensity = 0.75;
    targetCloudColor = "205,205,205";

}
else if([51,53,55,61,63,65,80,81,82].includes(weatherCode)){

    targetCloudDensity = 0.90;
    targetCloudColor = "170,175,185";

}
else if([95,96,99].includes(weatherCode)){

    targetCloudDensity = 1.00;
    targetCloudColor = "120,125,135";

}
else{

    targetCloudDensity = 0.50;
    targetCloudColor = "255,255,255";

}

/*=========================================
        DYNAMIC SKY COLOUR
=========================================*/


if(sky){

    if([61,63,65,80,81,82].includes(weatherCode)){

        // Rain
        sky.style.background =
        "linear-gradient(180deg,#24384f 0%,#3a4e64 45%,#66788b 100%)";

    }

    else if([95,96,99].includes(weatherCode)){

        // Thunderstorm
        sky.style.background =
        "linear-gradient(180deg,#08101b 0%,#121f2f 45%,#283746 100%)";

    }

    else if(weatherCode === 3){

        // Overcast
        sky.style.background =
        "linear-gradient(180deg,#59636e 0%,#7b8793 45%,#a4adb6 100%)";

    }

    else if([45,48].includes(weatherCode)){

        // Fog
        sky.style.background =
        "linear-gradient(180deg,#bfc8d1 0%,#d9dee4 45%,#f0f2f5 100%)";

    }

    else if([1,2].includes(weatherCode)){

        // Partly Cloudy
        sky.style.background =
        "linear-gradient(180deg,#5a8db8 0%,#88a9c8 45%,#c9d8e8 100%)";

    }

    else{

        // Clear weather
        updateBackgroundTheme();

    }

}
}
async function startApplication() {

    try {

updateConnectionStatus(
    navigator.onLine
);

cacheElements();

initWeatherCanvas();

await loadAllWeather();

        updateFeaturedCity();

        updateStateOverview();

        updateCityCards();

        updateForecast();

        updateAQI();

        updateWeatherAlerts();

        highlightFeaturedCity();

     startClock();

updateBackgroundTheme();
setInterval(updateBackgroundTheme, 60000);

startFrameRotation();

startTicker();

startRefreshCountdown();

        startAutoRefresh();
setInterval(() => {
    updateFeaturedCity();
}, 10000);
        hideLoadingScreen();

        console.log(

            `${CONFIG.APP_NAME} v${CONFIG.VERSION} started successfully.`

        );

    }

    catch (error) {

        console.error(
            "Startup Failed:",
            error
        );

    }

}

/*=========================================
        DOM READY
=========================================*/

window.addEventListener(
    "load",
    startApplication
);

/*==================================================
        ADVANCED LIVE FEATURES
==================================================*/

// Random weather background
function updateBackground() {
    const app = document.getElementById("app");

    const hour = new Date().getHours();

    if (hour >= 6 && hour < 18) {
        app.classList.remove("night-mode");
        app.classList.add("day-mode");
    } else {
        app.classList.remove("day-mode");
        app.classList.add("night-mode");
    }
}

// Live refresh indicator
function flashRefreshIndicator() {
    const indicator = document.getElementById("refresh-indicator");

    if (!indicator) return;

    indicator.classList.add("pulse");

    setTimeout(() => {
        indicator.classList.remove("pulse");
    }, 1000);
}

// Start advanced services
function startAdvancedServices() {

    updateBackground();

    setInterval(updateBackground, 60000);

    setInterval(flashRefreshIndicator, CONFIG.REFRESH_INTERVAL);

}

window.addEventListener("load", () => {
    startAdvancedServices();
});