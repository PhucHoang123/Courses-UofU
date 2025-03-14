/*
Author: Phuc Hoang
Assignment 3: Facades and Makefiles
Date: 9/8/2024
This class generate a string in along a sine wave with amplitude, wavelength, and angle increment functionalities.
*/
#ifndef HARUPDF_H
#define HARUPDF_H

#include <string>
#include "hpdf.h"

class HaruPDF
{
private:
    HPDF_Doc pdf;         // The PDF document object
    HPDF_Page page;       // The current page of the PDF
    std::string filename; // Filename for saving the PDF
    HPDF_Font font;       // Font used in the PDF
public:
    /// @brief Initializes the haruPDF
    /// @param filename
    HaruPDF(const std::string &filename);

    /// @brief Clean up the garbage
    ~HaruPDF();

    /// @brief Add a page to the document
    void addPage();

    /// @brief Place text at the given coordinates
    /// @param x
    /// @param y
    /// @param text
    /// @param fontSize
    void placeText(float x, float y, const std::string &text, float fontSize);

    /// @brief Save the PDF to a file
    void save();
};

#endif
