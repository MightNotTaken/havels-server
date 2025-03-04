#ifndef OUTPUT_GPIO_H__
#define OUTPUT_GPIO_H__
#include <Arduino.h>
#include <repeater.h>
#include <timeout.h>
#include <interval.h>

using namespace Repeaters;
using namespace Intervals;
using namespace Timeouts;

enum LogicLevel {
    ACTIVE_LOW = LOW,
    ACTIVE_HIGH = HIGH
};

enum PulseType {
    LOW_PULSE = LOW,
    HIGH_PULSE = HIGH
};

enum OutputGpioType {
    ON_BOARD_GPIO = 0,
    HC_595_GPIO   = 1,
    WS_2812_B     = 2
};

struct GpioMap {
    int gpio;
    OutputGpioType type;
    GpioMap(int gpio, OutputGpioType type);
    String getType();
    String toString();
};

enum LedState {
    LED_ON = HIGH,
    LED_OFF = LOW
};
class OutputGPIO {
private:
    Repeater* blinkRepeater;
    Timeout* blinkTimeout;

protected:
    LogicLevel logic;
    uint8_t gpio;
    LedState state;

public:
    OutputGPIO(uint8_t gpio, LogicLevel logic = LogicLevel::ACTIVE_HIGH, bool initialize = false);
    void setActiveLogic(LogicLevel logic);
    virtual void begin() = 0;
    virtual void turnOn() = 0;
    virtual void turnOff() = 0;
    virtual void setColor(uint32_t color, bool update = true);
    virtual void setRandomColor();
    void blink(uint32_t blinkSize, uint32_t blinks = 0xFFFFFFF);
    void pulse(uint32_t pulseSize, PulseType level);
    void stopBlink();
    void toggle();
    void setGPIO(uint8_t gpio);
    LedState getState();
    virtual ~OutputGPIO();
};

#endif