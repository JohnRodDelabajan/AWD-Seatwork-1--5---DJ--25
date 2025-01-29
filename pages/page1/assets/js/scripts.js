// Bus seat availability (each bus has a random number of seats left)
const buses = {
    bus1: Math.floor(Math.random() * 5),
    bus2: Math.floor(Math.random() * 5),
    bus3: Math.floor(Math.random() * 5)
};

// Function to check seat availability and show seats
function checkSeats() {
    const selectedBus = document.getElementById("bus-select").value;
    const availableSeats = buses[selectedBus];
    const result = document.getElementById('result');
    const busContainer = document.getElementById('bus-container');
    
    // Display the number of available seats and show the seats
    if (availableSeats > 0) {
        result.innerText = `✅ Bus has ${availableSeats} seats available. Reservation possible.`;
        busContainer.style.display = 'grid'; // Show the seat layout
    } else {
        result.innerText = `❌ No seats available for this bus.`;
        busContainer.style.display = 'none'; // Hide the seat layout if no seats are available
    }
}

// Function to toggle the seat selection
function toggleSeat(seatNumber) {
    const seat = document.getElementById(`seat${seatNumber}`);
    seat.classList.toggle('selected');
}
