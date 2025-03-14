/*
Author: Phuc Hoang
Assignment 2: Making a sine class
Date: 9/3/2024
Test file for the Sine class.
*/
#include "Sine.h"
#include <iostream>

int main() {
    // Construct a Sine object with amplitude 1.0 and wavelength 360.0 degrees
    Sine sine(2.0, 360.0, 1.0);

    // Loop from 0 to 360 degrees
    for (int i = 0; i <= 360; ++i) {
        std::cout << sine << std::endl;  // Output the current state of the sine object
        ++sine;  // Increment the angle of the sine object
    }

    return 0;
}
