# Mapty Web App

## ![Mapty map your workouts!](mapty.png 'Mapty map your workouts')

## Overview:

Mapty is a web application built using HTML, CSS, and JavaScript. It allows users to track and log their workouts using a map interface. Users can add new workouts by clicking on the map to get location coordinates, input details such as distance, time, pace, steps/minute or speed, elevation gain, and view all workouts in a list or on the map.

## Features:

1. **Map Interaction:**

   - Allows users to add new workouts by clicking on the map to get location coordinates.

2. **Geolocation:**

   - Uses geolocation to display the map at the user's current location, making it more user-friendly.

3. **Workout Input Forms:**

   - Provides forms to input workout details such as distance, time, pace, steps/minute, speed, and elevation gain.

4. **Display Workouts:**

   - Displays all workouts in a list.
   - Displays all workouts on the map for visualization.

5. **Local Storage:**

   - Stores workout data in the browser using the local storage API.
   - On page load, reads the saved data from local storage and displays it.

6. **Object-Oriented Programming (OOP):**

   - Utilizes object-oriented programming concepts for cleaner code organization and maintenance.

7. **Geolocation API and External Library:**
   - Uses the Geolocation API to fetch the user's current location.
   - Integrates with external libraries such as Leaflet to integrate maps and handle map functionalities.

## How to Run:

1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser.

## Usage:

- Click on the map to add a new workout.
- Fill out the workout details in the input forms.
- View all workouts in the list or on the map.
- The workout data will be automatically saved to local storage.

## Dependencies:

- Leaflet: External library for map integration.
