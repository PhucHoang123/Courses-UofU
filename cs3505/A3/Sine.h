/*
Author: Phuc Hoang
Assignment 3: Facades and Makefiles
Date: 9/8/2024
This class generate a string in along a sine wave with amplitude, wavelength, and angle increment functionalities.
*/
#ifndef SINE_H
#define SINE_H

class Sine
{
private:
    double Amp;            // Amplitude of the sine wave
    double Wave;           // Wavelength of the sine wave, must be non-zero
    double Angle;          // Current angle in degrees
    double AngleIncrement; // Increment step for the angle

public:
    /// @brief Initializes the sine wave with amplitude, wavelength, and angle increment
    /// @param amp
    /// @param wave
    /// @param angleIncrement
    Sine(double amp, double wave, double angleIncrement);

    /// @brief Accessor for current angle: Returns the angle in degrees
    /// @return double currentAngle
    double currentAngle() const;

    /// @brief Accessor for current height: Calculates the sine wave height at the current angle
    /// @return double angleHeight
    double currentHeight() const;

    /// @brief Pre-increment operator: Increments the angle by the specified increment
    /// @return
    Sine &operator++();

    /// @brief Post-increment operator: Returns the current object state before incrementing the angle
    /// @param  int
    /// @return temp
    Sine operator++(int);

    /// @brief Stream insertion operator: Enables output of the sine wave's properties via standard streams
    /// @param os
    /// @param obj
    /// @return os
    friend std::ostream &operator<<(std::ostream &os, const Sine &obj);
};

#endif
