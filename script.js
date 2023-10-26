"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const search = document.querySelector(".search");

class Workout{
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration){
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

////////////////////////////////
// A child class for calculating the pace

class Running extends Workout{
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace(){
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
////////////////////////////////
// A child class for calculating the speed
class Cycling extends Workout{
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed(){
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

////////////////////////////////////////////
// APPLICATION ARCHITECTURE

class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright',
    }).addTo(this.#map);

    //Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    console.log(this.#mapEvent);

    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    if (inputType.value === "cycling") {
      console.log("cycling");
      inputCadence.closest(".form__row").classList.add("form__row--hidden");
      inputElevation
        .closest(".form__row")
        .classList.remove("form__row--hidden");
    } else {
      console.log("running");
      inputCadence
        .closest(".form__row")
        .classList.remove("form__row--hidden");
      inputElevation.closest(".form__row").classList.add("form__row--hidden");
    }
  }

  _newWorkout(e) {
    const validINputs = (...inputs) => 
    inputs.every(inp => Number.isFinite(inp));

    const allPOsitives = (...inputs) => inputs.every(inp => inp > 0)

    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // Check if data is valid


    // if workout is running, create running object
    if(type === 'running'){
      const cadence = +inputCadence.value;
      // Check if data is valid
      if(
      //   !Number.isFinite(distance) 
      // || !Number.isFinite(duration) 
      // || !Number.isFinite(cadence))
      !validINputs(distance, duration, cadence) || 
      !allPOsitives(distance, duration, cadence)
      )

      
      return alert('Input have to be positive numbers!');
    }

    //if workout is cycling, create cycling object
    if(type === 'cycling'){
      const elevation = +inputElevation.value;
      // Check if data is valid

      if(type === 'running'){
        const cadence = +inputCadence.value;
        // Check if data is valid
        if(
        !validINputs(distance, duration, elevation) || 
        !allPOsitives(distance, duration)
        )
        return alert('Input have to be positive numbers!');
      }
    }

    // Add new object to workout array

    // Render workout on the map as marker
    const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng])
          .addTo(this.#map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: "running-popup",
            })
          )
          .setPopupContent("Workout")
          .openPopup();

    //clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

  }
}

//Create an object of the class

const app = new App();
console.log('Creating an object of the class')