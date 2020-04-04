const apiKey = "8dd754c90efa043abfd104f712f84448";
const apiRequest = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=mycity&appid=mykey"

const inputSearch = document.querySelector('.i-search');
const searchBtn = document.querySelector('.i-button');
const errorField = document.querySelector('.error-field');
const container = document.querySelector('.d-flex-cards');
const spinner = document.querySelector('.spinner');

const getData = () => {

    let inputValue = inputSearch.value.toLowerCase();
    const url = apiRequest.replace("mycity", inputValue).replace("mykey", apiKey);

    if(inputValue.length === 0) {
        errorField.textContent = 'Enter city name';
    } else  {
        spinner.removeAttribute('hidden');
        startFetch();
    }

    function startFetch() {
        fetch(url)
        .then((resolve) => {
            return resolve.json();
        })
        .catch((err) => {
            spinner.setAttribute('hidden', '');
            console.log('ERROR', err);
            errorField.textContent = err;
        })
        .then((data) => {
            if(data.cod === '404') {
                spinner.setAttribute('hidden', '');
                errorField.textContent = 'City not found :(';
            } else {
                spinner.setAttribute('hidden', '');
                errorField.textContent = '';

                let temp = Math.round(data.main.temp - 273.15);
                let sign = temp > 0 ? '+' : '';
                let description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
                let imgURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
                let sunriseTime = data.sys.sunrise;
                let sunsetTime = data.sys.sunset;
                let offset = data.timezone / 3600;
                
                const getDate = (timestamp, offset) => {
                    let date = new Date(timestamp * 1000);
                    let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                    let newDate = new Date(utc + (3600000*offset));

                    let hours = newDate.getHours();
                    let minutes = newDate.getMinutes();

                    if(hours.toString().length < 2) {
                        hours = '0' + hours;
                    }

                    if(minutes.toString().length < 2) {
                        minutes = '0' + minutes;
                    }

                    let time = hours + ':' + minutes;
                    return time;
                }

                let template = `
                <div class="d-flex-card">
                    <h2>${data.name}</h2>
                    <h2 class="temp">${sign}${temp}°</h2>
                    <img src=${imgURL} alt="">
                    <p>${description}</p>
                    <p>Sunrise: <span>${getDate(sunriseTime, offset)}</span></p>
                    <p>Sunset: <span>${getDate(sunsetTime, offset)}</span></p>
                    <input class="i-button-del" type="button" value="Delete">
                </div>
                `;
                container.insertAdjacentHTML('afterbegin', template);

                container.addEventListener('click', (event) => {
                    if(event.target.classList.contains('i-button-del')) {
                        let parent = event.target.parentNode;
                        parent.remove();
                    }
                });
                inputSearch.value = '';
            }
        })
    }
}


searchBtn.onclick = getData;

inputSearch.addEventListener('keypress', (event) => {
    if(event.keyCode === 13) {
        getData();
    }
});