#include <iostream>
#include "Car.h"

Car::Car(double speed) : speed(speed) {}

void Car::drive() {
    std::cout << "Zooming at " << speed << " mph." << std::endl;
}

void Car::slow() {
    speed = speed / 2;
    std::cout << "Slowing down to " << speed << " mph." << std::endl;
}

void Car::speedUp() {
    speed = speed * 1.5;
    std::cout << "Speeding up to " << speed << " mph." << std::endl;
}




