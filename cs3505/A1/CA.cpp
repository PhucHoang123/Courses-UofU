/*
Author: Phuc Hoang
Assignment 1: Cellcular Automata
Date: 8/26/2024
This  program simulates a cellular automaton, processing and displaying the evolution of cell states across generations
based on user-specified rules.
*/
#include <iostream>
using namespace std;

void convertRuleSetNumberToRuleSetArray(int rules, int *binaryArray);
void displayCurrentGeneration(int *currentGen, int size);
void computeNextGeneration(int *currentGen, int *nextGen, int length, int *binaryArray);
int convertNeighborhoodToIndex(int left, int center, int right);

int main()
{
    // Initialize
    int binaryArray[8] = {0};
    int currentGen[64];
    int nextGen[64];
    // Initialize all elements to 0
    for (int i = 0; i < 64; i++)
    {
        currentGen[i] = 0;
    }
    currentGen[32] = 1;

    int size;
    int userInput;

    // Ask for user input
    cout << "Enter the rules: ";
    cin >> userInput;

    // Check if the input is valid
    if (0 <= userInput && userInput <= 255 && !cin.fail())
    {
        convertRuleSetNumberToRuleSetArray(userInput, binaryArray);
        for (int i = 0; i < 50; i++)
        {
            displayCurrentGeneration(currentGen, 64);
            computeNextGeneration(currentGen, nextGen, 64, binaryArray);
        }
    }
    else
    {
        cout << "Number must be between 0 to 256" << endl;
        return 0;
    }
}

// Convert the rule number into binary array
void convertRuleSetNumberToRuleSetArray(int rules, int *binaryArray)
{
    int i = 0;
    while (rules > 0)
    {
        binaryArray[i] = rules % 2;
        rules = rules / 2;
        i++;
    }
}

// Display the current generation
void displayCurrentGeneration(int *currentGen, int size)
{
    for (int i = 0; i < size; i++)
    {
        if (currentGen[i] == 0)
        {
            cout << " ";
        }
        else
        {
            cout << "#";
        }
    }
    cout << endl;
}

// Compute the next generation
void computeNextGeneration(int *currentGen, int *nextGen, int length, int *binaryArray)
{
    nextGen[0] = currentGen[0];
    nextGen[length - 1] = currentGen[length - 1];

    for (int i = 1; i < length - 1; i++)
    {
        int left = currentGen[i - 1];
        int center = currentGen[i];
        int right = currentGen[i + 1];

        int index = convertNeighborhoodToIndex(left, center, right);
        nextGen[i] = binaryArray[index];
    }
    // Set the caculated next gen become the current gen
    for (int i = 0; i < length; i++)
    {
        currentGen[i] = nextGen[i];
    }
}

// Convert neighboor to index
int convertNeighborhoodToIndex(int left, int center, int right)
{
    int base10 = left * 4 + center * 2 + right * 1;
    return base10;
}
