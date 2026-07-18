/*==================================================
                NE WEATHER LIVE
                CONFIG.JS
==================================================*/

const CONFIG = {

    /*=========================================
                    APP
    =========================================*/

    APP_NAME: "NE Weather Live",

    VERSION: "1.0.0",

    AUTHOR: "Surojeet Das",

    DEFAULT_CITY: "Haflong",

    DEFAULT_COUNTRY: "India",

    LANGUAGE: "en",

    UNITS: "metric",

    TIME_FORMAT: "24h",

    REFRESH_INTERVAL: 300000,          // 5 Minutes

    CLOCK_INTERVAL: 1000,

    FORECAST_DAYS: 7,

    CITY_CHANGE_INTERVAL: 15000,       // 15 Seconds

    /*=========================================
                    API KEYS
    =========================================*/

    OPENWEATHER_KEY:
    "2120f9f1823e502225f641dcef474a8f",

    /*=========================================
                    API URLS
    =========================================*/

    OPENWEATHER_URL:

    "https://api.openweathermap.org/data/2.5/",

    AIR_QUALITY_URL:

    "https://api.openweathermap.org/data/2.5/air_pollution",

    GEOCODING_URL:

    "https://api.openweathermap.org/geo/1.0/direct",

    /*=========================================
                    RADAR
    =========================================*/

    RADAR:{

        CENTER:[25.67,94.10],

        ZOOM:7,

        MIN_ZOOM:5,

        MAX_ZOOM:12

    },

    /*=========================================
                    NORTHEAST INDIA
    =========================================*/

    CITIES:[

        {
            name:"Haflong",
            state:"Assam",
            lat:25.164,
            lon:93.017
        },

        {
            name:"Guwahati",
            state:"Assam",
            lat:26.1445,
            lon:91.7362
        },

        {
            name:"Silchar",
            state:"Assam",
            lat:24.8333,
            lon:92.7789
        },

        {
            name:"Diphu",
            state:"Assam",
            lat:25.843,
            lon:93.431
        },

        {
            name:"Lumding",
            state:"Assam",
            lat:25.749,
            lon:93.170
        },

        {
            name:"Hojai",
            state:"Assam",
            lat:26.002,
            lon:92.856
        },

        {
            name:"Nagaon",
            state:"Assam",
            lat:26.350,
            lon:92.684
        },

        {
            name:"Tezpur",
            state:"Assam",
            lat:26.652,
            lon:92.792
        },

        {
            name:"Jorhat",
            state:"Assam",
            lat:26.750,
            lon:94.203
        },

        {
            name:"Dibrugarh",
            state:"Assam",
            lat:27.472,
            lon:94.912
        },

        {
            name:"Tinsukia",
            state:"Assam",
            lat:27.492,
            lon:95.355
        },

        {
            name:"Karimganj",
            state:"Assam",
            lat:24.869,
            lon:92.355
        },

        {
            name:"Shillong",
            state:"Meghalaya",
            lat:25.578,
            lon:91.893
        },

        {
            name:"Tura",
            state:"Meghalaya",
            lat:25.514,
            lon:90.202
        },

        {
            name:"Jowai",
            state:"Meghalaya",
            lat:25.454,
            lon:92.198
        },

        {
            name:"Kohima",
            state:"Nagaland",
            lat:25.675,
            lon:94.108
        },

        {
            name:"Dimapur",
            state:"Nagaland",
            lat:25.909,
            lon:93.726
        },

        {
            name:"Mokokchung",
            state:"Nagaland",
            lat:26.324,
            lon:94.516
        },

        {
            name:"Imphal",
            state:"Manipur",
            lat:24.817,
            lon:93.936
        },

        {
            name:"Churachandpur",
            state:"Manipur",
            lat:24.333,
            lon:93.683
        },

        {
            name:"Agartala",
            state:"Tripura",
            lat:23.831,
            lon:91.286
        },

        {
            name:"Udaipur",
            state:"Tripura",
            lat:23.533,
            lon:91.484
        },

        {
            name:"Aizawl",
            state:"Mizoram",
            lat:23.727,
            lon:92.717
        },

        {
            name:"Lunglei",
            state:"Mizoram",
            lat:22.892,
            lon:92.743
        },

        {
            name:"Itanagar",
            state:"Arunachal Pradesh",
            lat:27.084,
            lon:93.605
        },

        {
            name:"Pasighat",
            state:"Arunachal Pradesh",
            lat:28.066,
            lon:95.326
        },

        {
            name:"Tawang",
            state:"Arunachal Pradesh",
            lat:27.586,
            lon:91.865
        },

        {
            name:"Gangtok",
            state:"Sikkim",
            lat:27.338,
            lon:88.606
        },

        {
            name:"Namchi",
            state:"Sikkim",
            lat:27.164,
            lon:88.363
        }

    ]

};

/*=========================================
        FREEZE CONFIG
=========================================*/

Object.freeze(CONFIG);