/*
Author: Phuc Hoang
Assignment 3: Facades and Makefiles
Date: 9/8/2024
This class generate a string in along a sine wave with amplitude, wavelength, and angle increment functionalities.
*/
#include "hpdf.h"
#include "HaruPDF.h"

// Construtor
HaruPDF::HaruPDF(const std::string &filename) : filename(filename)
{
    pdf = HPDF_New(NULL, NULL);
    addPage();
}

// Deconstructor
HaruPDF::~HaruPDF()
{
    HPDF_Free(pdf);
}

// Add a new page object.
void HaruPDF::addPage()
{
    page = HPDF_AddPage(pdf);
    HPDF_Page_SetSize(page, HPDF_PAGE_SIZE_A4, HPDF_PAGE_PORTRAIT);
}

// Text along a sine curve
void HaruPDF::placeText(float x, float y, const std::string &text, float fontSize)
{
    HPDF_Page_BeginText(page);
    HPDF_Page_SetFontAndSize(page, HPDF_GetFont(pdf, "Courier-Bold", NULL), fontSize);
    HPDF_Page_SetTextMatrix(page, 1.0, 0.0, 0.0, 1.0, x, y);
    HPDF_Page_ShowText(page, text.c_str());
    HPDF_Page_EndText(page);
}

// Save the document to a file
void HaruPDF::save()
{
    HPDF_SaveToFile(pdf, filename.c_str());
}