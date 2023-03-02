const wrapper = document.querySelector('.wrapper'),
  inputPart = wrapper.querySelector('.input-part'),
  infoTxt = inputPart.querySelector('.info-txt'),
  inputField = inputPart.querySelector('input'),
  locationBtn = inputPart.querySelector('button'),
  wIcon = document.querySelector('.weather-part img'),
  arrowBack = wrapper.querySelector('header i'),
  apiKey = 'd3dd613a1d6d4b5e7f644cd0d78ee34b';

let api;


inputField.addEventListener('keyup', e => {
  if (e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value)
  }
})

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetchData()
}

function fetchData() {
  infoTxt.innerText = 'Loading...';
  infoTxt.classList.add('pending');

  fetch(api)
    .then(response => response.json())
    .then(data => weatherDetails(data))
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace('pending', 'error');
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;

  } else {
    infoTxt.classList.remove('pending', 'error');
    wrapper.classList.add('active')

    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0]
    const { feels_like, humidity, temp } = info.main

    if (id == 800) { wIcon.src = './img/clear.svg' }
    else if (id >= 200 && id <= 232) { wIcon.src = './img/storm.svg' }
    else if (id >= 600 && id <= 622) { wIcon.src = './img/snow.svg' }
    else if (id >= 701 && id <= 781) { wIcon.src = './img/haze.svg' }
    else if (id >= 801 && id <= 804) { wIcon.src = './img/cloud.svg' }
    else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) { wIcon.src = './img/rain.svg' }

    wrapper.querySelector('.temp .numb').innerText = Math.floor(temp)
    wrapper.querySelector('.weather').innerText = description
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`
    wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like)
    wrapper.querySelector('.humidity span').innerText = `${humidity}%`
  }
}

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  } else {
    alert('Your browser not support geolocation API')
  }
})

function onSuccess(position) {
  const { latitude, longitude } = position.coords
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

  fetchData()
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add('error');
}

arrowBack.addEventListener('click', () => {
  wrapper.classList.remove('active')
  inputField.value = ''
})