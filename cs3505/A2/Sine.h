/*
Author: Phuc Hoang
Assignment 2: Making a sine class
Date: 9/3/2024
Header file for the Sine class.
*/
#ifndef SINE_H
#define SINE_H

#include <iostream> 

class Sine {
private:
    double Amp;           // Amplitude of the sine wave
    double Wave;          // Wavelength of the sine wave, must be non-zero
    double Angle;         // Current angle in degrees
    double AngleIncrement;// Increment step for the angle

public:
    // Constructor: Initializes the sine wave with amplitude, wavelength, and angle increment
    Sine(double amp, double wave, double angleIncrement);

    // Accessor for current angle: Returns the angle in degrees
    double currentAngle() const;

    // Accessor for current height: Calculates the sine wave height at the current angle
    double currentHeight() const;

    // Pre-increment operator: Increments the angle by the specified increment
    Sine& operator++(); 

    // Post-increment operator: Returns the current object state before incrementing the angle
    Sine operator++(int);

    // Stream insertion operator: Enables output of the sine wave's properties via standard streams
    friend std::ostream& operator<<(std::ostream& os, const Sine& obj);
};

#endif
