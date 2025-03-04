#ifndef COUNTER_H__
#define COUNTER_H__
#include <gpio-interface.h>
#include <input-gpio.h>
#include <Arduino.h>
#include <vector>
#include <timeout.h>

using namespace Timeouts;

struct PulseCounter_T {
    String name;
    uint32_t dumpTime;
    int incrementFactor;
    int gpio;
};
class PulseCounter {
    String name;
    uint32_t dumpTime;
    int incrementFactor;
    uint32_t referenceCount[24];
    uint32_t tempCount[24];
    uint32_t lastPublished[24];
    InputGPIO* gpio;
    Timeout* dumpTracker;
    bool synced;
public:
    PulseCounter(PulseCounter_T input);
    void synchronize(uint8_t hourDifference);
    void save();
    void flush();
    void load();
    String getDBRef(String ref = "data");
    bool isSynced();
    void publish();
};

namespace PulseCounterCtrl {
    extern std::vector<PulseCounter*> list;
    void registerCounter(PulseCounter_T input);
    void synchronize(uint8_t hourDifference);
    void beginDataLoop();
};
#endif
