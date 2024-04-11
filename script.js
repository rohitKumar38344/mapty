'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  id;
  date;
  clicks = 0;
  constructor(distance, duration, coords) {
    this.distance = distance; // in km
    this.duration = duration; // in min
    this.coords = coords; // [lat, lang]
    this.date = new Date();
    this.id = (Date.now() + '').slice(-10);
  }

  setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type.slice(0, 1).toUpperCase()}${this.type.slice(
      1
    )} on ${this.date.getDate()} ${months[this.date.getMonth()]}`;
  }
  // get id() {
  //   return this.#id;
  // }
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.calcPace();
    this.setDescription();
  }

  calcPace() {
    // min/Km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this.setDescription();
  }

  calcSpeed() {
    // Km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

////////////////////////////////////////
// APPLICATION ARCHITECHTURE
class App {
  #workouts = [];
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  constructor() {
    this.#getPosition();
    this.#getLocalStorage();

    // event handlers
    form.addEventListener('submit', this.#newWorkout.bind(this));
    inputType.addEventListener('change', this.#toggleElevationField);
    containerWorkouts.addEventListener('click', this.#moveToPopup.bind(this));
  }

  #getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        function () {
          alert("coudln't get your location");
        }
      );
    }
  }

  #loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(latitude, longitude);
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling clicks on map
    this.#map.on('click', this.#showForm.bind(this));
    this.#workouts.forEach(work => this.renderWorkoutMarker(work));
  }

  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  #hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  #toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  #newWorkout(e) {
    const validateInputs = (...params) =>
      params.every(param => Number.isFinite(param));
    const allPositive = (...params) => params.every(num => num > 0);
    e.preventDefault();

    // get workout data from form
    const workoutType = inputType.value;
    const distance = +inputDistance.value; // Number.parseInt(inputDistance.value)
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    // console.log(workoutType);
    let workout;

    // If workout running create running obj
    if (workoutType === 'running') {
      const cadence = +inputCadence.value;
      // validate the data
      if (
        !validateInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Invalid input values');
      workout = new Running(distance, duration, [lat, lng], cadence);
    }

    // If worlout cycling create cycling obj
    if (workoutType === 'cycling') {
      const elevationGain = +inputElevation.value;
      // validate the data
      if (
        !validateInputs(distance, duration, elevationGain) ||
        !allPositive(distance, duration)
      )
        return alert('Invalid input values');
      workout = new Cycling(distance, duration, [lat, lng], elevationGain);
    }
    console.log('workout created: ', workout);
    // store the new obj in the workouts arr
    this.#workouts.push(workout);

    // render workout as marker on the map
    this.renderWorkoutMarker(workout);

    // renders the workouts list
    this.renderWorkout(workout);

    // clear input field && hide the form
    this.#hideForm();

    // stores workout to localStorage
    this.#setLocalStorage();
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴'}${workout.description}`
      )
      .openPopup();
  }

  renderWorkout(workout) {
    console.log(workout);
    let html = `
        <li class="workout workout--${workout.type}" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          `;
    if (workout.type === 'running') {
      html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">spm</span>
            </div>
        `;
    }
    if (workout.type === 'cycling') {
      html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.elevationGain}</span>
              <span class="workout__unit">spm</span>
            </div>
        </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }

  #moveToPopup(e) {
    if (!this.#map) return;

    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);

    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    workout.click();
  }

  #setLocalStorage() {
    console.log(this.#workouts);
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  #getLocalStorage() {
    const workouts = JSON.parse(localStorage.getItem('workouts'));

    if (!workouts) return;
    this.#workouts = workouts;
    this.#workouts.forEach(work => {
      this.renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
