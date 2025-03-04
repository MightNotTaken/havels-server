#ifndef INPUT_GPIO_H__
#define INPUT_GPIO_H__

#include <event-handler.h>
#include <definitions.h>
#include <console.h>
#include <interval.h>
#include <timeout.h>
#include <repeater.h>
#include <memory>
#include <vector>

using namespace Intervals;
using namespace Timeouts;
using namespace Repeaters;

class InputGPIO: public EventHandler {
    uint8_t state;
    uint8_t logic;
    uint32_t debounceInMs;
    Repeater* stateTracker;
    Timeout* clickTracker;
    Timeout* clickFlusher;
    int repeats;
    int clicks;
    int id;
    static int count;
protected:
    uint8_t gpio;
    uint8_t mode;

public:
    InputGPIO(uint8_t gpio, uint8_t mode = INPUT);
    virtual ~InputGPIO();
    void setLogicLevel(uint8_t logic);
    void setDebounceTime(uint32_t debounce);
    void listen();
    void preventBubbling();
    int getID();
    virtual uint8_t getCurrentState();
    virtual void initialize();
    void forceTo(uint8_t state);
private:
    void updateClicks();
    void flush();
};

namespace InputGPIOs {
    // Using unique_ptr for automatic lifetime management.
    extern std::vector<std::unique_ptr<InputGPIO>> list;
    extern bool initialized;
    extern Interval* loopTracker;
    void unregister(InputGPIO* toBeDeleted);
    InputGPIO* registerNew(uint8_t gpio, uint8_t mode = INPUT);
    void listen();
};

#endif // INPUT_GPIO_H__
