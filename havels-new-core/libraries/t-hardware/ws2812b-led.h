#ifndef WS2811_LED_H__
#define WS2811_LED_H__
#include <output-gpio.h>
#include <Adafruit_NeoPixel.h>

#define WS2812_DATA_PIN 25

enum Color {
    RED      = 0xFF0000,
    GREEN    = 0x00FF00,
    BLUE     = 0x0000FF,
    ORANGE   = 0xFF0D00
};

class WS2812B: public OutputGPIO {
    static Adafruit_NeoPixel* WS2811;
    uint32_t color;
    uint8_t brightness;
public:
    WS2812B(uint8_t ledNumber);
    void begin() override;
    void turnOn() override;
    void turnOff() override;
    static void clear();
    void setBrightness(uint8_t brightness);
    void setRandomColor() override;
    void setColor(uint32_t color, bool update = true) override;
    static void initialize(int pixelCount, uint8_t dataPin = WS2812_DATA_PIN);
    ~WS2812B();
};
#endif