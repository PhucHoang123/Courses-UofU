/*
Author: Phuc Hoang
Assignment 4: A Trie and Rule-of-Three
Date: 9/14/2024
This program implements a Trie data structure for efficiently managing a dynamic set of strings,
supporting operations like insertion, search, and prefix-based retrieval.
*/
#include <iostream>
#include "Trie.h"

// Constructor
Trie::Trie()
{
    root = new Node();
}

// Destructor
Trie::~Trie()
{
    delete root;
}
// Copy constructor
Trie::Trie(const Trie &other)
{
    root = new Node(*(other.root));
}
// Assignment operator
Trie &Trie::operator=(Trie other)
{
    std::swap(root, other.root);
    return *this;
}
// Add word
void Trie::addWord(const std::string &wordToAdd)
{
    // Handle empty string if required
    if (wordToAdd.empty())
    {
        // According to specifications, do not add empty string
        return;
    }
    // Start at root
    Node *current = root;
    // Iliterate through all the char
    for (char letter : wordToAdd)
    {
        if (letter < 'a' || letter > 'z')
        {
            return; // Or handle the error as needed
        }
        int i = letter - 'a';
        if (!current->children[i])
        {
            // Create a new node if it does not exist
            current->children[i] = new Node;
        }
        current = current->children[i];
    }
    // Set end of word to true
    current->isCompleteWord = true;
}
// Is word
bool Trie::isWord(const std::string &wordToCheck) const
{
    // Check for empty string
    if (wordToCheck.empty())
    {
        return false;
    }
    // Start at root
    Node *current = root;

    for (char myLetter : wordToCheck)
    {
        int i = myLetter - 'a';
        if (i < 0 || i >= 26)
        {
            return false; // Invalid character
        }

        if (!current->children[i])
        {
            return false; // Path does not exist
        }

        current = current->children[i];
    }

    return current->isCompleteWord;
}

// Public method to retrieve all words starting with a prefix
std::vector<std::string> Trie::allWordsStartingWithPrefix(const std::string &prefix) const
{
    std::vector<std::string> words;
    // Check if prefix is empty
    if (prefix.empty())
    {
        collectWords(root, "", words);
        return words;
    }
    // Start at root
    Node *current = root;
    for (char ch : prefix)
    {
        int i = ch - 'a';
        // Check for valid 'a' - 'z' char
        if (i < 0 || i >= 26)
        {
            return words;
        }

        if (current->children[i] == nullptr)
        {
            return words; // No words starting with this prefix
        }
        current = current->children[i];
    }
    collectWords(current, prefix, words);
    return words;
}

// Recursive helper to collect words
void Trie::collectWords(Node *node, const std::string &prefix, std::vector<std::string> &results) const
{
    // Condition to break the recursion
    if (node == nullptr)
        return;
    if (node->isCompleteWord)
    {
        results.push_back(prefix);
    }
    for (int i = 0; i < 26; i++)
    {
        if (node->children[i] != nullptr)
        {
            char nextChar = 'a' + i;
            collectWords(node->children[i], prefix + nextChar, results);
        }
    }
}