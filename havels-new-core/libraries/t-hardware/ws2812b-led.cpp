#include "ws2812b-led.h"

Adafruit_NeoPixel* WS2812B::WS2811 = nullptr;
WS2812B::WS2812B(uint8_t ledNumber):
OutputGPIO(ledNumber) {
    this->begin();
}

void WS2812B::begin() {
    this->color = 0xFFFFFF;
    this->setBrightness(50);
    this->turnOff();
}

void WS2812B::initialize(int pixelCount, uint8_t dataPin) {
    // delete WS2812B::WS2811;
    WS2812B::WS2811 = new Adafruit_NeoPixel(pixelCount, dataPin, NEO_GRB + NEO_KHZ800);
    WS2812B::WS2811->begin();
}

void WS2812B::clear() {
    WS2812B::WS2811->clear();
}

void WS2812B::setColor(uint32_t color, bool update) {
    this->color = color;
    if (update) {
        this->turnOn();
    }
}

void WS2812B::setBrightness(uint8_t brightness) {
    this->brightness = brightness;
    WS2811->setBrightness(map(brightness, 0, 100, 0, 255));
}

void WS2812B::turnOn() {
    WS2811->setPixelColor(this->gpio, this->color);
    WS2811->show();
    this->state = LedState::LED_ON;   
}

void WS2812B::turnOff() {
    WS2811->setPixelColor(this->gpio, 0x000000);
    WS2811->show();
    this->state = LedState::LED_OFF;
}

WS2812B::~WS2812B() {
    delete WS2812B::WS2811;
}

void WS2812B::setRandomColor() {
    int8_t r = random(0, 255);
    int8_t g = random(0, 255);
    int8_t b = random(0, 255);
    uint32_t rgb = r;
    rgb <<= 8;
    rgb |= g;
    rgb <<= 8;
    rgb |= b;
    this->setColor(rgb);
}