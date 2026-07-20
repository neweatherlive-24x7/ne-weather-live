/*==================================================
                NE WEATHER LIVE
                CONFIG.JS
                VERSION 3.0
==================================================*/

const CONFIG = {

    /*=========================================
                    APP
    =========================================*/

    APP_NAME: "NE Weather Live",

    VERSION: "3.0.0",

    AUTHOR: "Surojeet Das",

    LANGUAGE: "en",

    UNITS: "metric",

    REFRESH_INTERVAL: 600000, // 10 Minutes

    FRAME_DURATION: 15000, // 15 Seconds
TICKER_INTERVAL: 10000, // 10 Seconds

    DEFAULT_CITY: "Haflong",

    DEFAULT_STATE: "Assam",

    /*=========================================
                API ENDPOINTS
    =========================================*/

    API: {

        WEATHER:
        "https://api.open-meteo.com/v1/forecast",

        AIR_QUALITY:
        "https://air-quality-api.open-meteo.com/v1/air-quality"

    },

    /*=========================================
                WEATHER VARIABLES
    =========================================*/

    WEATHER_PARAMS: [

    "temperature_2m",

    "relative_humidity_2m",

    "apparent_temperature",

    "pressure_msl",

    "surface_pressure",

    "wind_speed_10m",

    "wind_direction_10m",

    "visibility",

    "weather_code",

    "is_day",

    "uv_index"

].join(","),

    DAILY_PARAMS: [

        "weather_code",

        "temperature_2m_max",

        "temperature_2m_min",

        "sunrise",

        "sunset"

    ].join(","),

    AIR_PARAMS: [

        "us_aqi",

        "pm10",

        "pm2_5",

        "carbon_monoxide",

        "nitrogen_dioxide",

        "ozone"

    ].join(","),

    /*=========================================
                FRAME ROTATION
    =========================================*/

    FRAMES: [

        "frame-city",

        "frame-overview",

        "frame-cities-1",

        "frame-cities-2",

        "frame-cities-3",
        
        "frame-cities-4",

        "frame-forecast",

        "frame-aqi",

        "frame-alerts"

    ],

    /*=========================================
                TICKER
    =========================================*/

    TICKER_MESSAGES: [

        "Welcome to NE Weather Live.",

        "Real-time weather updates across North East India.",

        "Weather data powered by Open-Meteo.",

        "Stay informed. Stay prepared. Stay safe.",

        "Streaming 24 Hours a Day.",

        "Follow your local weather before travelling."

    ],

    /*=========================================
                WEATHER TIPS
    =========================================*/

    WEATHER_TIPS: [

        "Carry an umbrella during monsoon.",

        "Drink enough water during hot weather.",

        "Drive carefully during heavy rain.",

        "Avoid outdoor activities during thunderstorms.",

        "Check weather updates before long journeys.",

        "Protect children and elderly during extreme weather."

    ],
        /*=========================================
            WEATHER CODE MAPPING
    =========================================*/

    WEATHER_CODES: {

        0: {
            text: "Clear Sky",
            icon: "☀️"
        },

        1: {
            text: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            text: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            text: "Overcast",
            icon: "☁️"
        },

        45: {
            text: "Fog",
            icon: "🌫️"
        },

        48: {
            text: "Depositing Rime Fog",
            icon: "🌫️"
        },

        51: {
            text: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            text: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            text: "Dense Drizzle",
            icon: "🌧️"
        },

        56: {
            text: "Freezing Drizzle",
            icon: "🌧️"
        },

        57: {
            text: "Heavy Freezing Drizzle",
            icon: "🌧️"
        },

        61: {
            text: "Light Rain",
            icon: "🌦️"
        },

        63: {
            text: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            text: "Heavy Rain",
            icon: "🌧️"
        },

        66: {
            text: "Freezing Rain",
            icon: "🌧️"
        },

        67: {
            text: "Heavy Freezing Rain",
            icon: "🌧️"
        },

        71: {
            text: "Light Snow",
            icon: "🌨️"
        },

        73: {
            text: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            text: "Heavy Snow",
            icon: "❄️"
        },

        77: {
            text: "Snow Grains",
            icon: "🌨️"
        },

        80: {
            text: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            text: "Heavy Showers",
            icon: "🌧️"
        },

        82: {
            text: "Violent Showers",
            icon: "⛈️"
        },

        85: {
            text: "Snow Showers",
            icon: "🌨️"
        },

        86: {
            text: "Heavy Snow Showers",
            icon: "❄️"
        },

        95: {
            text: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            text: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            text: "Severe Thunderstorm",
            icon: "⛈️"
        }

    },

    /*=========================================
                AQI LEVELS
    =========================================*/

    AQI_LEVELS: [

        {
            min: 0,
            max: 50,
            label: "Good",
            class: "aqi-good"
        },

        {
            min: 51,
            max: 100,
            label: "Moderate",
            class: "aqi-moderate"
        },

        {
            min: 101,
            max: 150,
            label: "Unhealthy for Sensitive Groups",
            class: "aqi-sensitive"
        },

        {
            min: 151,
            max: 200,
            label: "Unhealthy",
            class: "aqi-poor"
        },

        {
            min: 201,
            max: 300,
            label: "Very Unhealthy",
            class: "aqi-hazardous"
        },

        {
            min: 301,
            max: 500,
            label: "Hazardous",
            class: "aqi-hazardous"
        }

    ],

    /*=========================================
            TEMPERATURE COLORS
    =========================================*/

    TEMP_CLASSES: [

        {
            max: 10,
            class: "temp-cold"
        },

        {
            max: 20,
            class: "temp-cool"
        },

        {
            max: 30,
            class: "temp-warm"
        },

        {
            max: 40,
            class: "temp-hot"
        },

        {
            max: 60,
            class: "temp-extreme"
        }

    ],

    /*=========================================
            WIND DIRECTIONS
    =========================================*/

    WIND_DIRECTIONS: [

        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW"

    ],
        /*=========================================
                NORTH EAST CITIES
    =========================================*/

    CITIES: [

        {
            id: 1,
            name: "Haflong",
            state: "Assam",
            latitude: 25.1648,
            longitude: 93.0174,
            featured: true
        },

        {
            id: 2,
            name: "Guwahati",
            state: "Assam",
            latitude: 26.1445,
            longitude: 91.7362
        },

        {
            id: 3,
            name: "Shillong",
            state: "Meghalaya",
            latitude: 25.5788,
            longitude: 91.8933
        },

        {
            id: 4,
            name: "Imphal",
            state: "Manipur",
            latitude: 24.8170,
            longitude: 93.9368
        },

        {
            id: 5,
            name: "Aizawl",
            state: "Mizoram",
            latitude: 23.7271,
            longitude: 92.7176
        },

        {
            id: 6,
            name: "Agartala",
            state: "Tripura",
            latitude: 23.8315,
            longitude: 91.2868
        },

        {
            id: 7,
            name: "Kohima",
            state: "Nagaland",
            latitude: 25.6751,
            longitude: 94.1086
        },

        {
            id: 8,
            name: "Gangtok",
            state: "Sikkim",
            latitude: 27.3389,
            longitude: 88.6065
        },

        {
            id: 9,
            name: "Itanagar",
            state: "Arunachal Pradesh",
            latitude: 27.0844,
            longitude: 93.6053
        },

        {
            id: 10,
            name: "Silchar",
            state: "Assam",
            latitude: 24.8333,
            longitude: 92.7789
        },

        {
            id: 11,
            name: "Dimapur",
            state: "Nagaland",
            latitude: 25.9091,
            longitude: 93.7266
        },

        {
            id: 12,
            name: "Lunglei",
            state: "Mizoram",
            latitude: 22.8925,
            longitude: 92.7425
        },

        {
            id: 13,
            name: "Tezpur",
            state: "Assam",
            latitude: 26.6338,
            longitude: 92.8000
        },

        {
            id: 14,
            name: "Jorhat",
            state: "Assam",
            latitude: 26.7509,
            longitude: 94.2037
        },

        {
            id: 15,
            name: "Dibrugarh",
            state: "Assam",
            latitude: 27.4728,
            longitude: 94.9120
        },

        {
            id: 16,
            name: "Tinsukia",
            state: "Assam",
            latitude: 27.4898,
            longitude: 95.3599
        },

        {
            id: 17,
            name: "Bongaigaon",
            state: "Assam",
            latitude: 26.4780,
            longitude: 90.5562
        },

        {
            id: 18,
            name: "Diphu",
            state: "Assam",
            latitude: 25.8436,
            longitude: 93.4316
        },

        {
            id: 19,
            name: "Karimganj",
            state: "Assam",
            latitude: 24.8692,
            longitude: 92.3554
        },

        {
            id: 20,
            name: "Dhubri",
            state: "Assam",
            latitude: 26.0186,
            longitude: 89.9856
        },

        {
            id: 21,
            name: "Goalpara",
            state: "Assam",
            latitude: 26.1667,
            longitude: 90.6167
        },

        {
            id: 22,
            name: "Nagaon",
            state: "Assam",
            latitude: 26.3500,
            longitude: 92.6833
        },

        {
            id: 23,
            name: "Sivasagar",
            state: "Assam",
            latitude: 26.9826,
            longitude: 94.6421
        },

        {
            id: 24,
            name: "Bokakhat",
            state: "Assam",
            latitude: 26.6402,
            longitude: 93.6154
        },

        {
            id: 25,
            name: "Lumding",
            state: "Assam",
            latitude: 25.7490,
            longitude: 93.1699
        },

        {
            id: 26,
            name: "Wokha",
            state: "Nagaland",
            latitude: 26.0972,
            longitude: 94.2586
        },

        {
            id: 27,
            name: "Churachandpur",
            state: "Manipur",
            latitude: 24.3333,
            longitude: 93.6833
        },

        {
            id: 28,
            name: "Pasighat",
            state: "Arunachal Pradesh",
            latitude: 28.0667,
            longitude: 95.3333
        },

        {
            id: 29,
            name: "Tawang",
            state: "Arunachal Pradesh",
            latitude: 27.5861,
            longitude: 91.8639
        }

    ],
        /*=========================================
                NORTH EAST STATES
    =========================================*/

    STATES: [

        {
            name: "Assam",
            capital: "Dispur",
            displayCity: "Guwahati",
            latitude: 26.1445,
            longitude: 91.7362,
            abbreviation: "AS"
        },

        {
            name: "Arunachal Pradesh",
            capital: "Itanagar",
            displayCity: "Itanagar",
            latitude: 27.0844,
            longitude: 93.6053,
            abbreviation: "AR"
        },

        {
            name: "Manipur",
            capital: "Imphal",
            displayCity: "Imphal",
            latitude: 24.8170,
            longitude: 93.9368,
            abbreviation: "MN"
        },

        {
            name: "Meghalaya",
            capital: "Shillong",
            displayCity: "Shillong",
            latitude: 25.5788,
            longitude: 91.8933,
            abbreviation: "ML"
        },

        {
            name: "Mizoram",
            capital: "Aizawl",
            displayCity: "Aizawl",
            latitude: 23.7271,
            longitude: 92.7176,
            abbreviation: "MZ"
        },

        {
            name: "Nagaland",
            capital: "Kohima",
            displayCity: "Kohima",
            latitude: 25.6751,
            longitude: 94.1086,
            abbreviation: "NL"
        },

        {
            name: "Sikkim",
            capital: "Gangtok",
            displayCity: "Gangtok",
            latitude: 27.3389,
            longitude: 88.6065,
            abbreviation: "SK"
        },

        {
            name: "Tripura",
            capital: "Agartala",
            displayCity: "Agartala",
            latitude: 23.8315,
            longitude: 91.2868,
            abbreviation: "TR"
        }

    ],

    /*=========================================
                REGION INFO
    =========================================*/

    REGION: {

        NAME: "North East India",

        TOTAL_STATES: 8,

        TOTAL_CITIES: 29,

        TIMEZONE: "Asia/Kolkata",

        COUNTRY: "India"

    },

    /*=========================================
            DEFAULT ANIMATION
    =========================================*/

    ANIMATION: {

        FRAME_FADE: 800,

        CARD_FADE: 500,

        TICKER_SPEED: 28000,

        CLOCK_UPDATE: 1000

    },
        /*=========================================
            WEATHER ALERT MESSAGES
    =========================================*/

    ALERTS: {

        CLEAR:
        "No active weather warnings for North East India.",

        RAIN:
        "Heavy rainfall may cause waterlogging in low-lying areas.",

        THUNDERSTORM:
        "Thunderstorms are possible. Stay indoors during lightning.",

        FOG:
        "Low visibility due to fog. Drive carefully.",

        HEAT:
        "High temperatures expected. Stay hydrated and avoid prolonged sun exposure.",

        COLD:
        "Cold conditions expected in higher elevations. Wear warm clothing."

    },

    /*=========================================
            WEATHER BACKGROUNDS
    =========================================*/

    BACKGROUNDS: {

        CLEAR: "clear",

        CLOUDY: "cloudy",

        RAIN: "rain",

        STORM: "storm",

        SNOW: "snow",

        FOG: "fog",

        NIGHT: "night"

    },

    /*=========================================
            REFRESH SETTINGS
    =========================================*/

    REFRESH: {

        WEATHER: 600000,

        AQI: 900000,

        CLOCK: 1000,

        TICKER: 10000

    },

    /*=========================================
            DEBUG
    =========================================*/

    DEBUG: {

        ENABLE_LOGS: true,

        SHOW_ERRORS: true

    }

};

/*==================================================
                END OF CONFIG
==================================================*/

