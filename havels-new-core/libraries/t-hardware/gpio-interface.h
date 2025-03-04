#ifndef GPIO_INTERFACE_H__
#define GPIO_INTERFACE_H__
#include "output-gpio.h"

OutputGPIO* getGpioFromMap(GpioMap mapping, LogicLevel logic = LogicLevel::ACTIVE_HIGH);

#endif