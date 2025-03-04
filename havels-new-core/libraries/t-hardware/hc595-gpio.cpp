#include "hc595-gpio.h"

bool Hc595GPIO::initialized = false;
uint8_t Hc595GPIO::sh_data;
uint8_t Hc595GPIO::st_cp;
uint8_t Hc595GPIO::sh_cp;
int Hc595GPIO::bits;
Shifty Hc595GPIO::expander;

Hc595GPIO::Hc595GPIO(uint8_t gpio, LogicLevel logic):
OutputGPIO(gpio, logic) {
    this->begin();
}

void Hc595GPIO::initializeChip(uint8_t bits, uint8_t sh_data, uint8_t st_cp, uint8_t sh_cp) {
    Hc595GPIO::bits = bits;
    Hc595GPIO::sh_data = sh_data;
    Hc595GPIO::st_cp = st_cp;
    Hc595GPIO::sh_cp = sh_cp;
    expander.setBitCount(bits);
    expander.setPins(sh_data, sh_cp, st_cp);
}

void Hc595GPIO::clear() {
    for (int i=0; i<Hc595GPIO::bits; i++) {
        expander.writeBit(i, LOW);
    }
}

void Hc595GPIO::begin() {
    if (!this->initialized) {
        this->initializeChip();
        this->initialized = true;
    }
}


void Hc595GPIO::turnOn() {
    expander.writeBit(this->gpio, this->logic);
    this->state = LedState::LED_ON;
}

void Hc595GPIO::turnOff() {
    expander.writeBit(this->gpio, !this->logic);
    this->state = LedState::LED_OFF;
}

