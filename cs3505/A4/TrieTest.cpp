/*
Author: Phuc Hoang
Assignment 4: A Trie and Rule-of-Three
Date: 9/14/2024
This program implements a Trie data structure for efficiently managing a dynamic set of strings,
supporting operations like insertion, search, and prefix-based retrieval.
*/
#include <vector>
#include <iostream>
#include <fstream>
#include <cstring>
#include "Trie.h"
using namespace std;

void testRuleOfThree(Trie &originalTrie)
{
    // Copy constructor test
    Trie copyTrie = originalTrie;
    cout << "Testing copy constructor:" << endl;

    // Add a test word
    originalTrie.addWord("testword");
    cout << "Added word to original Trie." << endl;

    // Check if 'testword' is in copiedTrie
    // 'testword' should not be in copiedTrie since the word is added after the creation of copiedTrie
    cout << "Checking if added word is in the copied Trie: " << (copyTrie.isWord("testword") ? "Found" : "Not Found") << endl;
    // Original should have the word added
    cout << "Checking if added word is in the original Trie: " << (originalTrie.isWord("testword") ? "Found" : "Not Found") << endl;

    // Assignment operator test
    Trie assignTrie;
    assignTrie = originalTrie;
    cout << "Testing assignment operator." << endl;
    originalTrie.addWord("anotherword");
    cout << "Added 'testword' to original Trie." << endl;

    // Check if 'testword2' is in assignTrie
    // 'testword2' should not be in assignTrie since the word is added after the creation of assignTrie
    cout << "Checking if 'anotherword' is in the assigned Trie: " << (assignTrie.isWord("anotherword") ? "Found" : "Not Found") << endl;
    // Original should not have the word added
    cout << "Checking if 'anotherword' is in the original Trie: " << (originalTrie.isWord("anotherword") ? "Found" : "Not Found") << endl;
}
int main(int argc, char **argv)
{
    Trie trie;
    string line;
    string wordFile = argv[1];
    string queriesFile = argv[2];

    // Test open 2 files of text one with word and 1 with prefix
    // Word Text open
    ifstream myWordFile(wordFile);
    if (myWordFile.is_open())
    {
        while (getline(myWordFile, line))
        {
            // Add them into the tree
            trie.addWord(line);
        }
        myWordFile.close();
    }

    else
        cout << "Unable to open file";

    // Prefix text open
    ifstream myQuerFile(queriesFile);
    if (myQuerFile.is_open())
    {
        while (getline(myQuerFile, line))
        {
            // Check for the word
            cout << "Checking text: " << line << endl;
            if (trie.isWord(line))
            {

                cout << "Word found" << endl;
            }
            else
            {
                cout << "Word not found" << endl;
            }
            // collect all the word with starting prefix
            vector<string> results = trie.allWordsStartingWithPrefix(line);
            cout << "Words starting with '" << line << "': ";
            for (const auto &word : results)
            {
                cout << word << " ";
            }
            cout << endl;
        }
        myQuerFile.close();
        cout << endl;
    }
    else
    {
        cout << "Unable to open file";
        return 1;
    }
    // Test the rule of three
    testRuleOfThree(trie);
    return 0;
}
