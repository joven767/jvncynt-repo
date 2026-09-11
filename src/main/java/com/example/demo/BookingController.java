package com.example.demo;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class BookingController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final File dataFile = new File("data/data.json");

    /*
     * SAVE
     */
    @PostMapping("/booking")
    public ResponseEntity<?> saveBooking(
            @RequestBody BookingRequest request) {

        try {

            // Basic validation
            if (request.getFirstName() == null ||
                request.getFirstName().isBlank()) {

                return ResponseEntity.badRequest()
                        .body("First name is required.");
            }

            if (request.getLastName() == null ||
                request.getLastName().isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Last name is required.");
            }

            if (request.getDob() == null ||
                request.getDob().isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Date of birth is required.");
            }

            // Read existing records
            List<Booking> bookings = readBookings();

            // Generate unique confirmation
            String confirmation = generateConfirmation(bookings);

            // Create booking
            Booking booking = new Booking(
                    confirmation,
                    request.getFirstName(),
                    request.getLastName(),
                    request.getDob()
            );

            // Add to list
            bookings.add(booking);

            // Save to JSON
            writeBookings(bookings);

            // Return confirmation
            return ResponseEntity.ok(booking);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Unable to save booking.");
        }
    }


    /*
     * FETCH
     */
    @GetMapping("/booking/{confirmation}")
    public ResponseEntity<?> getBooking(
            @PathVariable String confirmation) {

        try {

            List<Booking> bookings = readBookings();

            for (Booking booking : bookings) {

                if (booking.getConfirmation()
                        .equalsIgnoreCase(confirmation)) {

                    return ResponseEntity.ok(booking);
                }
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Unable to retrieve booking.");
        }
    }


    /*
     * READ JSON FILE
     */
    private List<Booking> readBookings() throws Exception {

        if (!dataFile.exists()) {

            dataFile.getParentFile().mkdirs();

            writeBookings(new ArrayList<>());

            return new ArrayList<>();
        }

        return objectMapper.readValue(
                dataFile,
                new TypeReference<List<Booking>>() {}
        );
    }


    /*
     * WRITE JSON FILE
     */
    private void writeBookings(List<Booking> bookings)
            throws Exception {

        dataFile.getParentFile().mkdirs();

        objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValue(dataFile, bookings);
    }


    /*
     * GENERATE CONFIRMATION
     */
    private String generateConfirmation(
            List<Booking> bookings) {

        String confirmation;

        do {

            confirmation = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();

        } while (confirmationExists(
                confirmation,
                bookings
        ));

        return confirmation;
    }


    /*
     * CHECK DUPLICATE
     */
    private boolean confirmationExists(
            String confirmation,
            List<Booking> bookings) {

        for (Booking booking : bookings) {

            if (booking.getConfirmation()
                    .equalsIgnoreCase(confirmation)) {

                return true;
            }
        }

        return false;
    }
}