let conditions;

async function getConditions() {
  const url = `https://www.weatherapi.com/docs/conditions.json`
  const response = await fetch(url)
  conditions = await response.json()


  return conditions
}

getConditions()

const apiKey = 'c2c6a891c3354e0a832104345232302'

// elements 
const header = document.querySelector(".header")
const form = document.querySelector("#form")
const input = document.querySelector("#inputCity")

function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
  const html = `<div class="card">${errorMessage} </div>`
  header.insertAdjacentHTML('afterend', html);
}

function showCard({ name, country, temp, condition, imgPath }) {
  const html = `
     <div class="card">
       <h2 class="card-city">${name} <span>${country}</span></h2>
 
       <div class="card-weather">
         <div class="card-value">${temp.toFixed()}<sup>°c</sup></div>
         <img src=${imgPath} alt="Weather" class="card-img">
       </div>
 
       <div class="card-description">${condition}</div>
     </div>`

  header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
  const response = await fetch(url)
  const data = await response.json()

  return data
}

// listen for form submission
form, onsubmit = async function (e) {
  // cancel send form
  e.preventDefault()

  let city = input.value.trim();

  const data = await getWeather(city)

  if (data.error) {
    removeCard()
    showError(data.error.message)

  } else {
    removeCard()

    const info = conditions.find((obj) => obj.code === data.current.condition.code)

    // if local weather icon
    // const imgPath = filePath + fileName;
    // const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/'
    // const fileName = (data.current.is_day ? info.day : info.night) + '.png'

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day ? info['day'] : info['night'],
      imgPath: data.current.condition.icon
    }

    showCard(weatherData)
  }
}