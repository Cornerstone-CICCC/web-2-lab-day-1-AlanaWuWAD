const getCity = async (city) =>{
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const data = await res.json()
    return data.results// data is object
}

const getWeather = async (latitude, longitude) =>{
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
    const data = await res.json()
    return data
}

const buildHtml = async (cityInput) => {
    const cityData = await getCity(cityInput)
    const weatherData = await getWeather(cityData[0].latitude, cityData[0].longitude)

    let weather = document.querySelector('.weather')
    let weatherHtml=`
        <h1>${cityInput}</h1>
        <h3>${weatherData.current.temperature_2m} ${weatherData.daily_units.temperature_2m_max}</h3>
        `
    weather.innerHTML = weatherHtml

    let table = document.querySelector('.table')
    let tableHtml = `
        <table class="tableInfo">
            <tr>
            <td id="bold" style="width: 350px;">Country</td>
            <td style="width: 500px;">${cityData[0].country}</td>
            </tr>
            <tr>
            <td id="bold">TimeZone</td>
            <td>${weatherData.timezone}</td>
            </tr>
            <tr>
            <td id="bold">Population</td>
            <td>${cityData[0].population}</td>
            </tr>
            <tr>
            <td id="bold">Tomorrow Forecast</td>       
            <td>Low: ${weatherData.daily.temperature_2m_min} ${weatherData.daily_units.temperature_2m_max}
            <br>Max: ${weatherData.daily.temperature_2m_max} ${weatherData.daily_units.temperature_2m_max}</td>
            </tr>
        </table>
    `
    table.innerHTML = tableHtml

    const day = weatherData.current.is_day
    const btnSearch = document.querySelector('.btn-search')
    const searchText = document.querySelector('#city')
    const body = document.querySelector('body')
    const tableInfo = document.querySelector('.tableInfo')

    if(day){
        weather.classList.add('day')
        body.classList.add('body-day')
        tableInfo.classList.add('tableInfon-day')
        weather.classList.remove('night')
        body.classList.remove('body-night')
        tableInfo.classList.remove('tableInfo-night')
        btnSearch.classList.remove('btnSearch-night')
        searchText.classList.remove('searchText-night')
    }else{
        weather.classList.add('night')
        body.classList.add('body-night')
        tableInfo.classList.add('tableInfo-night')
        btnSearch.classList.add('btnSearch-night')
        searchText.classList.add('searchText-night')
        weather.classList.remove('day')
        body.classList.remove('body-day')
        tableInfo.classList.remove('tableInfon-day')
      
    }

}

const searchBtn = document.querySelector('.btn-search')
searchBtn.addEventListener('click',() => {
    const city = document.getElementById("city").value
    buildHtml(city)
})