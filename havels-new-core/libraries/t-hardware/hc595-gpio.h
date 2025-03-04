#ifndef HC595_GPIO_H__
#define HC595_GPIO_H__
#include "output-gpio.h"
#include <Shifty.h>

#define HC_595_SH_DATA 14
#define HC_595_ST_CP   26
#define HC_595_SH_CP   27

class Hc595GPIO: public OutputGPIO {
    static uint8_t sh_data;
    static uint8_t st_cp;
    static uint8_t sh_cp;
    static int bits;
    static bool initialized;
    static Shifty expander;
public:
    Hc595GPIO(uint8_t gpio, LogicLevel logic = LogicLevel::ACTIVE_HIGH);
    static void initializeChip(uint8_t bits = 16, uint8_t sh_data = HC_595_SH_DATA, uint8_t st_cp = HC_595_ST_CP, uint8_t sh_cp = HC_595_SH_CP);
    void begin();
    void turnOn();
    void turnOff();
    void clear();
};
#endif