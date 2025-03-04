#ifndef CONFIG_H__
#define CONFIG_H__
#include <vector>
#include <Arduino.h>
#include <gpio-interface.h>
#include "pulse-counter.h"

// #define ST1_ST2_ST3_ST4
#define ST5_ST6_ST7_ST8
// #define ST9
// #define ST10_ST11


namespace Configuration {
  namespace PulseCounters {
    extern std::vector<PulseCounter_T> list;
  };
  String getConfiguration();
};
#endif