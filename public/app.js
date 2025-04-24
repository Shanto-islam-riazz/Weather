const condition = document.getElementById('condition')
const city = document.getElementById('city')
const country = document.getElementById('country')
const mainText = document.getElementById('main')
const description = document.getElementById('description')
const temp = document.getElementById('temp')
const pressure = document.getElementById('pressure')
const humidity = document.getElementById('humidity')

const cityInput = document.getElementById('city-input')
const historyElm = document.getElementById('history')
const masterHistory = document.getElementById('master-history')

const API_KEY = '87cf0382253d6e6911c9ac5791ebbb99'
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`
const ICON_URL =' https://openweathermap.org/img/w/'
const DEFAULT_CITY = "Dhaka,bd"

window.onload = function () {
    navigator.geolocation.getCurrentPosition(s => {
        getWeatherData(null, s.coords)
    }, e => {
        getWeatherData()
    })

    axios.get('/api/history')
        .then(({ data }) => {
            if (data.length > 0){
                updateHistory(data)
            }else {
                historyElm.innerHTML = 'There is no History'
            }
        })
        // .catch (e => {
        //     console.log(e)
        //     alert('Error Occured')
        // })

    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (e.target.value){
                getWeatherData(e.target.value, null, weather => {
                    e.target.value = ''
                    axios.post('/api/history', weather)
                    .then(({ data }) => updateHistory(data)) 
                    // .catch(e => { 
                    //     console.log(e)
                    //     alert('Error Occured')
                    // })
                })
               
            } else { 
                alert ('Please Enter a Valid  City Name')
            }
        }
    })
}

function getWeatherData(city=DEFAULT_CITY, coords, cb){
    let url = BASE_URL

    city === null ?

    url = `${url}&lat=${coords.latitude}&lon=${coords.longtitude}` :
    url = `${url}&q=${city}`
    
    axios.get(url)
        .then(({data}) => {
            let weather = {
                icon: data.weather[0].icon,
                name: data.name,
                country: data.sys.country,
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: data.main.temp,
                pressure: data.main.pressure,
                humidity: data.main.humidity
            }

            setWeather(weather)
            if (cb) cb(weather)
        })
        // .catch(e => {
        //     console.log(e)
        //     alert('City Not Found')
        // })
}

function setWeather(weather){
    condition.src = `${ICON_URL}${weather.icon}.png`
    city.innerHTML = weather.name
    country.innerHTML = weather.country
    mainText.innerHTML = weather.main
    description.innerHTML = weather.description
    temp.innerHTML = weather.temp
    pressure.innerHTML = weather.pressure
    humidity.innerHTML = weather.humidity
}

function updateHistory(history) {
    historyElm.innerHTML = ''
    history = history.reverse()

    history.forEach(h => {
      let tempHistory = masterHistory.cloneNode(true)  
      tempHistory.id = ''
      temp.History.getElementByClassName('condition')[0].src = `${ICON_URL}${h.icon}.png`
      temp.History.getElementByClassName('city')[0].innerHTML = h.name
      temp.History.getElementByClassName('country')[0].innerHTML = h.country
      temp.History.getElementByClassName('main')[0].innerHTML = h.main
      temp.History.getElementByClassName('description')[0].innerHTML = h.description
      temp.History.getElementByClassName('temp')[0].innerHTML = h.temp
      temp.History.getElementByClassName('pressure')[0].innerHTML = h.pressure
      temp.History.getElementByClassName('humidity')[0].innerHTML = h.humidity
    })
}