#include <input-gpio.h>
#include <Arduino.h>

int InputGPIO::count = 0;

InputGPIO::InputGPIO(uint8_t gpio, uint8_t mode)
    : gpio(gpio), debounceInMs(250), logic(LOW), clicks(0), mode(mode),
      stateTracker(nullptr), clickTracker(nullptr), clickFlusher(nullptr),
      repeats(0)
{
    InputGPIO::count++;
    this->id = InputGPIO::count;
    this->state = this->getCurrentState();
    this->initialize();
}

void InputGPIO::initialize() {
    pinMode(gpio, mode);
}

uint8_t InputGPIO::getCurrentState() {
    return digitalRead(this->gpio);
}

void InputGPIO::flush() {
    this->clicks = 0;
    clearRepeater(this->stateTracker);
    clearTimeout(this->clickTracker);
    clearTimeout(this->clickFlusher);
}

InputGPIO::~InputGPIO() {
    this->flush();
}

void InputGPIO::preventBubbling() {
    this->flush();
}

void InputGPIO::updateClicks() {
    clearTimeout(this->clickFlusher);
    clearTimeout(this->clickTracker);
    this->clickTracker = setTimeout([this]() {
        this->clicks++;
        if (this->clicks == 1) {
            this->call("click");
        }
        else if (this->clicks == 2) {
            this->call("double-click");
        }
        else if (this->clicks > 2) {
            this->call(String("multi-click:") + this->clicks);
        }
    }, this->debounceInMs / 2, &this->clickTracker);
    this->clickFlusher = setTimeout([this]() {
        this->clicks = 0;
    }, 2 * this->debounceInMs, &this->clickFlusher);
}

int InputGPIO::getID() {
    return this->id;
}

void InputGPIO::forceTo(uint8_t state) {
    this->state = state;
}

void InputGPIO::listen() {
    uint8_t currentState = this->getCurrentState();
    if (currentState != this->state) {
        this->state = currentState;
        this->call("change", String(currentState));
        switch (currentState) {
            case HIGH:
                this->call("high");
                break;
            case LOW:
                this->call("low");
                break;
        }
        if (currentState == this->logic) {
            this->updateClicks();
            this->repeats = 0;
            // Clear any existing repeater before creating a new one.
            clearRepeater(this->stateTracker);
            this->stateTracker = setRepeater([this]() {
                if (this->repeats > 1) {
                    this->call("continuous-press", String(this->repeats));
                }
                if (this->repeats == 0) {
                    this->call("press");
                } else {
                    this->call(String("press-") + this->repeats + 'x');
                }
                this->repeats++;
            }, this->debounceInMs, 100, &this->stateTracker);
        } else {
            this->repeats = 0;
            clearRepeater(this->stateTracker);
            this->call("release");
        }
    }
}

void InputGPIO::setDebounceTime(uint32_t debounce) {
    this->debounceInMs = debounce;
}

void InputGPIO::setLogicLevel(uint8_t logic) {
    this->logic = logic;
}

namespace InputGPIOs {
    // Changed from vector of raw pointers to vector of unique_ptr.
    std::vector<std::unique_ptr<InputGPIO>> list;

    void unregister(InputGPIO* toBeDeleted) {
        auto it = list.begin();
        while (it != list.end()) {
            if ((*it)->getID() == toBeDeleted->getID()) {
                // Unique_ptr will automatically delete the object.
                it = list.erase(it);
                list.shrink_to_fit();
                return;
            }
            else {
                ++it;
            }
        }
    }

    InputGPIO* registerNew(uint8_t gpio, uint8_t mode) {
        // Create a unique_ptr and release the raw pointer for return.
        auto gpioPtr = std::make_unique<InputGPIO>(gpio, mode);
        InputGPIO* rawPtr = gpioPtr.get();
        list.push_back(std::move(gpioPtr));
        return rawPtr;
    }

    void listen() {
        for (auto& input : list) {
            input->listen();
        }
    }
}
