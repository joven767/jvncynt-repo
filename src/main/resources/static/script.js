/*
 * CREATE BOOKING
 */

const bookingForm = document.getElementById("bookingForm");

const submitResult = document.getElementById("submitResult");

const confirmationResult = document.getElementById("confirmationResult");

bookingForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();

  const lastName = document.getElementById("lastName").value.trim();

  const dob = document.getElementById("dob").value;

  const booking = {
    firstName: firstName,

    lastName: lastName,

    dob: dob,
  };

  try {
    const response = await fetch("/api/booking", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      const error = await response.text();

      throw new Error(error);
    }

    const savedBooking = await response.json();

    confirmationResult.textContent = savedBooking.confirmation;

    submitResult.classList.remove("hidden");

    // Clear form

    bookingForm.reset();
  } catch (error) {
    alert("Error saving booking: " + error.message);
  }
});

/*
 * FETCH BOOKING
 */

const fetchButton = document.getElementById("fetchButton");

const fetchResult = document.getElementById("fetchResult");

const errorMessage = document.getElementById("errorMessage");

fetchButton.addEventListener("click", async function () {
  const confirmation = document.getElementById("confirmation").value.trim();

  // Clear previous results

  fetchResult.classList.add("hidden");

  errorMessage.classList.add("hidden");

  if (!confirmation) {
    errorMessage.textContent = "Please enter a confirmation number.";

    errorMessage.classList.remove("hidden");

    return;
  }

  try {
    const response = await fetch(
      "/api/booking/" + encodeURIComponent(confirmation),
    );

    if (response.status === 404) {
      errorMessage.textContent = "Confirmation number not found.";

      errorMessage.classList.remove("hidden");

      return;
    }

    if (!response.ok) {
      throw new Error("Unable to retrieve booking.");
    }

    const booking = await response.json();

    document.getElementById("fetchConfirmation").textContent =
      booking.confirmation;

    document.getElementById("fetchFirstName").textContent = booking.firstName;

    document.getElementById("fetchLastName").textContent = booking.lastName;

    document.getElementById("fetchDob").textContent = booking.dob;

    fetchResult.classList.remove("hidden");
  } catch (error) {
    errorMessage.textContent = error.message;

    errorMessage.classList.remove("hidden");
  }
});
