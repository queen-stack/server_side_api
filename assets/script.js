var userFormEl = document.querySelector("#city_name");
var nameInputEl = document.querySelector("#cityname");
var button = document.querySelector('.button')
var inputValue = document.querySelector('.inputValue')
var name = document.querySelector('.name');
var description = document.querySelector('.description');
var temperature = document.querySelector('.temperature');

button.addEventListener('click'.function(){
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=588cfb5bf5bb11ec2e52fa3f89a7adc3')
  .then(response => response.json())
  then(data => console.log(data))
  .catch(err => alert('Incorrect city name!'))


