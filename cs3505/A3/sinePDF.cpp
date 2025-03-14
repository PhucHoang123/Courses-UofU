/*
Author: Phuc Hoang
Assignment 3: Facades and Makefiles
Date: 9/8/2024
This class generate a string in along a sine wave with amplitude, wavelength, and angle increment functionalities.
*/
#include "HaruPDF.h"
#include "Sine.h"
#include <cstring>

int main(int argc, char **argv)
{

    char fname[256];
    strcpy(fname, argv[0]);
    strcat(fname, ".pdf");
    // Retrieve the input text from the command-line argument
    std::string inputText = argv[1];
    // Create the HaruPDF object with the file name
    HaruPDF pdf(fname);

    // Value needed to create a sine wave and easy adjust
    double amplitude = 60.0;
    double wavelength = 180.0;
    double angleIncrement = 10.0;

    Sine sineWave(amplitude, wavelength, angleIncrement);

    // Initial coordinates for the sine wave text and font size
    float xStart = 10.0;
    float yCenter = 400.0;
    float fontSize = 20;
    // Loop through each character of the input text and place it along the sine wave
    for (size_t i = 0; i < inputText.length(); ++i)
    {
        // Calculate the x and y position for each character
        // Adjust the spacing between characters
        float x = xStart + (i * 20);
        // Get the y-position from the sine wave
        float y = yCenter + sineWave.currentHeight();

        // Convert char to string
        std::string charToPlace(1, inputText[i]);
        // Place the character on the PDF
        pdf.placeText(x, y, charToPlace, fontSize);

        // Increment the sine wave
        ++sineWave;
    }

    // Save the PDF
    pdf.save();
    return 0;
}
