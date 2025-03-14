# Compiler and flags
CC = g++
CFLAGS = -Wall -g -fsanitize=address

# Target executable
TARGET = TrieTest

# Object files
OBJS = Trie.o TrieTest.o

# Build the exe program
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJS)

# Compile Trie.o
Trie.o: Trie.cpp Trie.h
	$(CC) $(CFLAGS) -c Trie.cpp

# Compile TrieTest.o
TrieTest.o: TrieTest.cpp Trie.h
	$(CC) $(CFLAGS) -c TrieTest.cpp

#remove the executable and object files
clean:
	rm -f $(OBJS) $(TARGET)

