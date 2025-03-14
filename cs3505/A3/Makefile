CC = g++
LIBHARU = ../libharu
CFLAGS = -I$(LIBHARU)/include
LDFLAGS = -L$(LIBHARU)/src -lhpdfs
TARGET = sinePDF
OBJS = sinePDF.o HaruPDF.o Sine.o

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJS) $(LDFLAGS)

# Make sinePDF.o
sinePDF.o: sinePDF.cpp
	$(CC) $(CFLAGS) -c sinePDF.cpp

# Make HaruPDF.o
HaruPDF.o: HaruPDF.cpp
	$(CC) $(CFLAGS) -c HaruPDF.cpp

# Make Sine.o
Sine.o: Sine.cpp
	$(CC) $(CFLAGS) -c Sine.cpp

# Clean up all the output and target
clean:
	rm -f $(OBJS) $(TARGET)