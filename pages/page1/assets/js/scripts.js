// Bus data including schedule, seats, and fare
const buses = {
    bus1: { schedule: [{ time: '12:30 AM', class: 'Regular Aircon', seats: 32, fare: 641 }] },
    bus2: { schedule: [{ time: '02:00 PM', class: 'Deluxe', seats: 49, fare: 800 }] },
    bus3: { schedule: [{ time: '05:00 PM', class: 'VIP', seats: 20, fare: 1200 }] }
};

// DOM elements
const seatLayout = document.getElementById('seat-layout');
const busSelector = document.getElementById('bus');
const scheduleBody = document.getElementById('schedule');
const reserveBtn = document.getElementById('reserve');
const destinationSelector = document.getElementById('destination');

// Initialize current bus and trip index
let currentBus = 'bus1';
let currentTripIndex = 0;
let currentDestination = destinationSelector.value;

// Initialize local storage for reserved seats
if (!localStorage.getItem('reservedSeats')) {
    localStorage.setItem('reservedSeats', JSON.stringify({}));
}

// Event listeners for changes in destination or bus selection
destinationSelector.addEventListener('change', () => {
    currentDestination = destinationSelector.value;
    updateSchedule();
    displayReservedSeats();
});

busSelector.addEventListener('change', () => {
    currentBus = busSelector.value;
    updateSchedule();
});

// Function to update the bus schedule table
function updateSchedule() {
    const bus = buses[currentBus];
    scheduleBody.innerHTML = '';

    // Loop through each trip to display in the schedule table
    bus.schedule.forEach((trip, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trip.time}</td>
            <td>${trip.class}</td>
            <td>${trip.seats - getReservedSeatsCount(currentDestination, currentBus, index)}</td>
            <td>₱${trip.fare}</td>
            <td><button onclick="loadSeats(${trip.seats}, ${index})">Book</button></td>
        `;
        scheduleBody.appendChild(row);
    });
}

// Function to load the seat layout based on available seats
function loadSeats(totalSeats, tripIndex) {
    currentTripIndex = tripIndex;
    seatLayout.innerHTML = '';

    const reservedSeats = getReservedSeats(currentDestination, currentBus, tripIndex);

    // Create seat elements dynamically
    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.textContent = i;

        if (reservedSeats.includes(i)) {
            seat.classList.add('occupied');
        }

        seat.addEventListener('click', () => {
            if (!seat.classList.contains('occupied')) {
                seat.classList.toggle('selected');
            }
        });

        seatLayout.appendChild(seat);
    }
}

// Function to get the reserved seats for a specific destination, bus, and trip
function getReservedSeats(destination, bus, tripIndex) {
    const reservedData = JSON.parse(localStorage.getItem('reservedSeats'));
    return reservedData[destination]?.[bus]?.[tripIndex] || [];
}

// Function to get the count of reserved seats
function getReservedSeatsCount(destination, bus, tripIndex) {
    return getReservedSeats(destination, bus, tripIndex).length;
}

// Event listener for the reserve button
reserveBtn.addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const numPassengers = document.getElementById('passenger-count').value;

    // Check if selected seats match passenger count
    if (selectedSeats.length != numPassengers) {
        alert('Number of selected seats must match passenger count.');
        return;
    }

    const reservedData = JSON.parse(localStorage.getItem('reservedSeats'));

    // Ensure proper structure for storing reserved seats
    if (!reservedData[currentDestination]) reservedData[currentDestination] = {};
    if (!reservedData[currentDestination][currentBus]) reservedData[currentDestination][currentBus] = [];
    if (!reservedData[currentDestination][currentBus][currentTripIndex]) {
        reservedData[currentDestination][currentBus][currentTripIndex] = [];
    }

    // Reserve the selected seats
    selectedSeats.forEach(seat => {
        const seatNumber = parseInt(seat.textContent);
        reservedData[currentDestination][currentBus][currentTripIndex].push(seatNumber);
        seat.classList.add('occupied'); // Mark seat as occupied
    });

    reservedData[currentDestination][currentBus][currentTripIndex] = [...new Set(reservedData[currentDestination][currentBus][currentTripIndex])];
    localStorage.setItem('reservedSeats', JSON.stringify(reservedData));

    alert('Seats reserved successfully!');
    updateSchedule();
    displayReservedSeats();
});

// Function to display reserved seats
function displayReservedSeats() {
    const reservedSeatsSection = document.getElementById('reserved-seats-list');
    const reservedData = JSON.parse(localStorage.getItem('reservedSeats'));

    reservedSeatsSection.innerHTML = '';

    if (!reservedData[currentDestination]) return;

    Object.keys(reservedData[currentDestination]).forEach((bus) => {
        reservedData[currentDestination][bus].forEach((seats, index) => {
            if (seats.length > 0) {
                const reservedInfo = document.createElement('div');
                reservedInfo.classList.add('reserved-bus-info');
                reservedInfo.innerHTML = `
                    <p><strong>${bus.charAt(0).toUpperCase() + bus.slice(1)}</strong></p> 
                    <p>Reserved Seats: ${seats.join(', ')}</p>
                `;
                reservedSeatsSection.appendChild(reservedInfo);
            }
        });
    });
}

// Initial load to display schedule and reserved seats
updateSchedule();
displayReservedSeats();
