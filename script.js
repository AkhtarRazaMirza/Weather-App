document.addEventListener("DOMContentLoaded", function () {
    //  Grabing elements
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const tempEl = document.getElementById('temperatureNumber');
    const cityName = document.getElementById("cityName");
    const weatherCondition = document.getElementById("weatherCondition");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("windSpeed");
    const sunrise = document.getElementById("sunrise");
    const sunset = document.getElementById("sunset");
    const visibilityEl = document.getElementById("visibility");
    const pressure = document.getElementById("pressure");
    const permission = document.getElementById("permissionSection");
    const permissionBtn = document.getElementById("permissionBtn");
    const manualBtn = document.getElementById("manualBtn");

    // my api key
    let api_key = "e8174aad8c848ef7fbe459982af32245";

    // theme switcher
    let currentTheme = 'dark';
    body.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', currentTheme);
    });

    // update clock every second
    function updateDateTime() {
        const now = new Date();
        const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('en-IN', dateOpts);
        const timeStr = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        currentDate.textContent = dateStr;
        currentTime.textContent = timeStr;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // get user location
    permissionBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            saveCodes(latitude, longitude);
            try {
                let weatherData = await fetchWeatherByCoords(latitude, longitude);
                console.log(weatherData);
                showWeatherDetails(weatherData);
                permission.style.display = 'none';
            } catch (error) {
                console.log("Unable to fetch weather data for your location.");
            }
        }, (error) => {
            throw new error("Location access denied. Please use manual city search.");
        }
        );
    });

    // fetch weather by using codinates
    async function fetchWeatherByCoords(lat, lon) {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
        let request = await fetch(url);
        if (!request.ok) {
            throw new Error("Unable to fetch weather data for your location.");
        }
        let data = await request.json()
        return data;
    }

    // manual city add
    manualBtn.addEventListener('click', () => {
        permission.style.display = 'none';
    });

    // search functionality - Api fetching
    async function handleSearch() {
        const query = searchInput.value.trim();
        if (query === "") return
        try {
            let weatherData = await fechweatherdeta(query);
            console.log(weatherData);
            showWeatherDetails(weatherData);

        } catch (error) {
            throw new Error("city con'n found");
        }
        async function fechweatherdeta(city) {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
            let request = await fetch(url);

            if (!request.ok) {
                throw new Error("city con'n found");
            };
            let deta = await request.json()
            return deta;
        }
        searchInput.value = "";
    }
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });


    // Showing weather details
    function showWeatherDetails(data) {
        let { main, weather, name, icon, timezone, wind, visibility, sys } = data;

        animateTemp(tempEl, main.temp, 2000);
        cityName.textContent = name;
        weatherCondition.textContent = weather[0].description;
        humidity.textContent = main.humidity;
        windSpeed.textContent = wind.speed;
        sunrise.textContent = sundetails(sys.sunrise);
        sunset.textContent = sundetails(sys.sunset);
        pressure.textContent = main.pressure;
        visibilityEl.textContent = `${visibility / 1000} km`; // convert to km
    }

    // animate temp number on load - looks cool
    function animateTemp(target, endValue, duration) {
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const progress = currentTime - startTime;
            const value = Math.min(Math.floor((progress / duration) * endValue), endValue);
            target.textContent = value;
            if (value < endValue) {
                requestAnimationFrame(animation);
            }
        }
        requestAnimationFrame(animation);
    }


    // sunries and sunset time 
    function sundetails(ries) {
        // Validate inputs
        if (typeof ries !== 'number') return 'N/A';

        // sys.sunrise/sys.sunset are UTC unix seconds; timezone is offset in seconds.
        const utcMillis = ries * 1000;
        const localTime = new Date(utcMillis);

        return localTime.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    // saving the code for future use
    function saveCodes(lat, lon) {
        localStorage.setItem('latitude', JSON.stringify(lat));
        localStorage.setItem('longitude', JSON.stringify(lon));
    }

    // using saved codes for showing weather 
    async function loadSavedLocation() {
        const savedLat = JSON.parse(localStorage.getItem('latitude'));
        const savedLon = JSON.parse(localStorage.getItem('longitude'));
        if (savedLat && savedLon) {
            try {
                let weatherData = await fetchWeatherByCoords(savedLat, savedLon);
                console.log(weatherData);
                showWeatherDetails(weatherData);
                permission.style.display = 'none';
            } catch (error) {
                console.log("Unable to fetch weather data for your location.");
            }
        }
    }
    loadSavedLocation();
})





// this part is paiding
// const hourlySlider = document.getElementById('hourlySlider');


// drag to scroll on hourly forecast
//   let isDown = false;
//   let startX;
//   let scrollLeft;

//   hourlySlider.style.cursor = 'grab';

//   hourlySlider.addEventListener('mousedown', (e) => {
//     isDown = true;
//     hourlySlider.style.cursor = 'grabbing';
//     startX = e.pageX - hourlySlider.offsetLeft;
//     scrollLeft = hourlySlider.scrollLeft;
//   });

//   hourlySlider.addEventListener('mouseleave', () => {
//     isDown = false;
//     hourlySlider.style.cursor = 'grab';
//   });

//   hourlySlider.addEventListener('mouseup', () => {
//     isDown = false;
//     hourlySlider.style.cursor = 'grab';
//   });

//   hourlySlider.addEventListener('mousemove', (e) => {
//     if (!isDown) return;
//     e.preventDefault();
//     const x = e.pageX - hourlySlider.offsetLeft;
//     const walk = (x - startX) * 2; // scroll speed
//     hourlySlider.scrollLeft = scrollLeft - walk;
//   });


// touch support for mobile
//   hourlySlider.addEventListener('touchstart', (e) => {
//     startX = e.touches[0].pageX - hourlySlider.offsetLeft;
//     scrollLeft = hourlySlider.scrollLeft;
//   }, { passive: true });

//   hourlySlider.addEventListener('touchmove', (e) => {
//     const x = e.touches[0].pageX - hourlySlider.offsetLeft;
//     const walk = (x - startX) * 2;
//     hourlySlider.scrollLeft = scrollLeft - walk;
//   }, { passive: true });

//   hourlySlider.style.scrollBehavior = 'smooth';

//  hourlySlider.setAttribute('tabindex', '0');

// keyboard arrows for accessibility
// hourlySlider.addEventListener('keydown', (e) => {
//     if (e.key === 'ArrowLeft') {
//       hourlySlider.scrollLeft -= 116;
//     } else if (e.key === 'ArrowRight') {
//       hourlySlider.scrollLeft += 116;
//     }
// });
