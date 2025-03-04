#ifndef ON_BOARD_GPIO_H__
#define ON_BOARD_GPIO_H__
#include "output-gpio.h"
class OnboardGPIO: public OutputGPIO {
public:
    OnboardGPIO(uint8_t gpio, LogicLevel logic = LogicLevel::ACTIVE_HIGH);
    void begin() override;
    void turnOn() override;
    void turnOff() override;
};
#endif