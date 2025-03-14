/*
Author: Phuc Hoang
Assignment 3: Facades and Makefiles
Date: 9/8/2024
This class generate a string in along a sine wave with amplitude, wavelength, and angle increment functionalities.
*/
#include <cmath>
#include <iostream>
#include "Sine.h"

// Constructor implementation
Sine::Sine(double amp, double wave, double angleIncrement)
    : Amp(amp), Wave(wave), Angle(0), AngleIncrement(angleIncrement)
{
}

// Return the current angle of the sine wave
double Sine::currentAngle() const
{
    return Angle;
}

// Calculate and return the current height of the sine wave based on the sine of the angle
double Sine::currentHeight() const
{
    return Amp * sin(2 * M_PI * Angle / Wave); // Angle must be converted from degrees to radians
}

// Pre-increment operator: Increments the angle by AngleIncrement, then returns the modified object
Sine &Sine::operator++()
{
    Angle += AngleIncrement;
    return *this;
}

// Post-increment operator: Creates a temporary object, increments the current object's angle,
// then returns the temporary object holding the old state
Sine Sine::operator++(int)
{
    Sine temp(*this);
    ++(*this);
    return temp;
}

// Stream insertion operator: Formats the sine wave's current angle and height for output
std::ostream &operator<<(std::ostream &os, const Sine &obj)
{
    os << obj.currentAngle() << ", " << obj.currentHeight();
    return os;
}
