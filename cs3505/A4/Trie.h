/*
Author: Phuc Hoang
Assignment 4: A Trie and Rule-of-Three
Date: 9/14/2024
This program implements a Trie data structure for efficiently managing a dynamic set of strings,
supporting operations like insertion, search, and prefix-based retrieval.
*/
#ifndef TRIE_H
#define TRIE_H
#include <iostream>
#include <string>
#include <vector>

using std::string;
using std::vector;

class Trie
{
private:
    // Nested class Node in Trie
    class Node
    {
    public:
        // pointer from a to z
        Node *children[26];

        bool isCompleteWord;

        Node() : isCompleteWord(false)
        {
            for (int i = 0; i < 26; i++)
            {
                children[i] = nullptr;
            }
        }

        // Destructor to clean up child nodes
        ~Node()
        {
            for (int i = 0; i < 26; ++i)
            {
                delete children[i];
                // Safe guard for no dangling pointer
                children[i] = nullptr;
            }
        }

        // Copy constructor
        Node(const Node &other) : isCompleteWord(other.isCompleteWord)
        {
            for (int i = 0; i < 26; i++)
            {
                if (other.children[i])
                {
                    children[i] = new Node(*other.children[i]);
                }
                else
                {
                    // Safe guard for no dangling pointer
                    children[i] = nullptr;
                }
            }
        }

        // Assignment operator
        Node &operator=(Node other)
        {
            std::swap(isCompleteWord, other.isCompleteWord);
            std::swap(children, other.children);
            return *this;
        }
    };
    Node *root;
    // Private helper method to collect word start with the prefix
    void collectWords(Node *node, const std::string &prefix, std::vector<std::string> &results) const;

public:
    /// @brief Construtor
    Trie();
    /// @brief Destructor
    ~Trie();
    /// @brief Copy constructor
    Trie(const Trie &other);
    /// @brief Assignment operator
    Trie &operator=(Trie other);
    /// @brief Method to add word into trie
    /// @param wordToAdd
    void addWord(const std::string &wordToAdd);
    /// @brief  Method to check id the word is valid
    /// @param wordToCheck
    /// @return True False
    bool isWord(const std::string &wordToCheck) const;
    /// @brief To collect all the word starting with the prefix
    /// @param prefix
    /// @return All the word contain prefix
    std::vector<std::string> allWordsStartingWithPrefix(const std::string &prefix) const;
};
#endif