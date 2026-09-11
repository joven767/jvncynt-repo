package com.example.demo;

public class Booking {

    private String confirmation;
    private String firstName;
    private String lastName;
    private String dob;

    public Booking() {
    }

    public Booking(String confirmation, String firstName, String lastName, String dob) {
        this.confirmation = confirmation;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
    }

    public String getConfirmation() {
        return confirmation;
    }

    public void setConfirmation(String confirmation) {
        this.confirmation = confirmation;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }
}