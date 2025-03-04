#include <onboard-gpio.h>
#include <console.h>

OnboardGPIO::OnboardGPIO(uint8_t gpio, LogicLevel logic):
OutputGPIO(gpio, logic, false) {
    this->begin();
}

void OnboardGPIO::begin() {
    pinMode(this->gpio, OUTPUT);
}

void OnboardGPIO::turnOn() {
    digitalWrite(this->gpio, this->logic);
    this->state = LedState::LED_ON;
}

void OnboardGPIO::turnOff() {
    digitalWrite(this->gpio, !this->logic);
    this->state = LedState::LED_OFF;
}