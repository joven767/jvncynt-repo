const bookingForm = document.getElementById("bookingForm");

const submitResult = document.getElementById("submitResult");

const confirmationResult = document.getElementById("confirmationResult");

const fetchButton = document.getElementById("fetchButton");

const fetchResult = document.getElementById("fetchResult");

const errorMessage = document.getElementById("errorMessage");

// Get existing bookings from browser storage
function getBookings() {
  const storedBookings = localStorage.getItem("bookings");

  if (!storedBookings) {
    return [];
  }

  return JSON.parse(storedBookings);
}

// Save bookings to browser storage
function saveBookings(bookings) {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

// Generate confirmation number
function generateConfirmation() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

  const length = 8;

  let confirmation;

  const bookings = getBookings();

  do {
    confirmation = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);

      confirmation += characters[randomIndex];
    }
  } while (bookings.some((booking) => booking.confirmation === confirmation));

  return confirmation;
}

// Submit booking
bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();

  const lastName = document.getElementById("lastName").value.trim();

  const dob = document.getElementById("dob").value;

  const confirmation = generateConfirmation();

  const booking = {
    confirmation: confirmation,

    firstName: firstName,

    lastName: lastName,

    dob: dob,
  };

  const bookings = getBookings();

  bookings.push(booking);

  saveBookings(bookings);

  confirmationResult.textContent = confirmation;

  submitResult.classList.remove("hidden");

  bookingForm.reset();
});

// Fetch booking
fetchButton.addEventListener("click", function () {
  const confirmation = document
    .getElementById("confirmation")
    .value.trim()
    .toUpperCase();

  fetchResult.classList.add("hidden");

  errorMessage.classList.add("hidden");

  if (!confirmation) {
    errorMessage.textContent = "Please enter a confirmation number.";

    errorMessage.classList.remove("hidden");

    return;
  }

  const bookings = getBookings();

  const booking = bookings.find((item) => item.confirmation === confirmation);

  if (!booking) {
    errorMessage.textContent = "Confirmation number not found.";

    errorMessage.classList.remove("hidden");

    return;
  }

  document.getElementById("fetchConfirmation").textContent =
    booking.confirmation;

  document.getElementById("fetchFirstName").textContent = booking.firstName;

  document.getElementById("fetchLastName").textContent = booking.lastName;

  document.getElementById("fetchDob").textContent = booking.dob;

  fetchResult.classList.remove("hidden");
});
