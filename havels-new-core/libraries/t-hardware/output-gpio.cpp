#include <output-gpio.h>
#include <console.h>

GpioMap::GpioMap(int gpio, OutputGpioType type):
gpio(gpio), type(type) {
}

String GpioMap::getType() {
    switch (this->type) {
        case OutputGpioType::ON_BOARD_GPIO: return "ON_BOARD_GPIO";
        case OutputGpioType::HC_595_GPIO: return "HC_595_GPIO";
    }
    return "UNKNOWN_GPIO";
}

String GpioMap::toString() {
    return String("gpio: ") + gpio + "\ntype: " + this->getType();
}

OutputGPIO::OutputGPIO(uint8_t gpio, LogicLevel logic, bool initialize):
gpio(gpio), logic(logic), blinkRepeater(nullptr), blinkTimeout(nullptr) {
    if (initialize) {
        this->begin();
    }
}

void OutputGPIO::setActiveLogic(LogicLevel logic) {
    this->logic = logic;
}

void OutputGPIO::begin() {
    pinMode(this->gpio, OUTPUT);
}

void OutputGPIO::turnOn() {
    digitalWrite(this->gpio, this->logic);
    this->state = LedState::LED_ON;
}

void OutputGPIO::turnOff() {
    digitalWrite(this->gpio, !this->logic);
    this->state = LedState::LED_OFF;
}

void OutputGPIO::setRandomColor() {
    console.log("setRandomColor not implemented");
}


void OutputGPIO::setColor(uint32_t color, bool update) {
    console.log("setColor not implemented");
}

void OutputGPIO::toggle() {
    this->state == LedState::LED_OFF ? this->turnOn() : this->turnOff();
}

void OutputGPIO::blink(uint32_t blinkSize, uint32_t blinks) {
    this->stopBlink();
    this->blinkRepeater = setRepeater([this, blinkSize]() {
        this->turnOn();
        this->blinkTimeout = setTimeout([this]() {
            this->turnOff();
        }, blinkSize / 2 - 1, &this->blinkTimeout);
    }, blinkSize, blinks, &this->blinkRepeater);
}

void OutputGPIO::pulse(uint32_t pulseSize, PulseType level) {
    static Timeout* reference = nullptr;
    if (level == PulseType::LOW_PULSE) {
        this->turnOff();
    } else {
        this->turnOn();
    }
    clearTimeout(reference);
    reference = setTimeout([this]() {
        this->toggle();
    }, pulseSize, &reference);
}

void OutputGPIO::stopBlink() {
    clearRepeater(this->blinkRepeater);
    clearTimeout(this->blinkTimeout);
    this->turnOff();
}

OutputGPIO::~OutputGPIO() {
    this->stopBlink();
}

void OutputGPIO::setGPIO(uint8_t gpio) {
    this->gpio = gpio;
}

LedState OutputGPIO::getState() {
    return this->state;
}