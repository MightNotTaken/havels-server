#include "gpio-interface.h"
#include "hc595-gpio.h"
#include "onboard-gpio.h"
#include <ws2812b-led.h>

OutputGPIO* getGpioFromMap(GpioMap mapping, LogicLevel logic) {
    switch(mapping.type) {
        case OutputGpioType::ON_BOARD_GPIO: return new OnboardGPIO(mapping.gpio, logic);
        case OutputGpioType::HC_595_GPIO: return new Hc595GPIO(mapping.gpio, logic);
        case OutputGpioType::WS_2812_B: return new WS2812B(mapping.gpio);
    }
    return nullptr;
}
