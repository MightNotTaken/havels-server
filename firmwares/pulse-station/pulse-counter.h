#ifndef PULSE_COUNTER_H__
#define PULSE_COUNTER_H__
#include "core/counter.h"
#include "core/gpio.h"
#include "core/GPIO/input.h"
#include "core/JSON.h"
#include "core/utility/console.h"
#include "core/database.h"
#include "core/core.h"
#include "core/utility/event-handler.h"
#include "core/mac.h"

class PulseCounter: public EventHandler<std::function<void(String)>> {
  JSON content;
  String station;
  int hour;
  bool synced;
  InputGPIO* pulseSource;
  int incrementFactor;
public:
  PulseCounter(String station, std::vector<int> pulseGPIOs):
  station(station), hour(0), synced(false) {
    console.log("Initializing pulse counter for", station, "on pin", pulseGPIOs);
    incrementFactor = 1;
    if (!Database::hasFile(contentFile())) {
      content = JSON("{}");
      content["actual"]="[]";
      content["temp"]="[]";
      for (int i=0; i<24; i++) {
        int count = 0;
        content["actual"].push_back(count);
        content["temp"].push_back(count);
      }
      this->save();
    }
    Database::readFile(contentFile());
    content.resetContent(Database::payload());
    for (auto gpio: pulseGPIOs) {
      InputGPIO* input = new InputGPIO(gpio, INPUT_PULLUP);
      input->onStateLow([this]() {
        this->increaseCount();
      });
      GPIOs::registerInput(input);
    }
  }

  void setHour(int hour) {
    this->hour = hour;
  }

  void setIncrementFactor(int incrementFactor) {
    this->incrementFactor = incrementFactor;
  }

  void sync() {
    synced = true;
  }

  void save() {
    Database::writeFile(contentFile(), content.toString());
  }

  void merge() {
    for (int i=0; i<24; i++) {
      int index = (hour + i) % 24;
      content["actual"][index] = content["actual"][index].toInt() + content["temp"][i].toInt();
    }
    for (int i=0; i<24; i++) {
      content["temp"][i] = 0;
    }
    this->save();
    console.log("After merging", content);
  }

  String contentFile() {
    return String("/count/") + station + ".cnt";
  }

  void increaseCount() {
    String key = synced ? "actual" : "temp";
    content[key][hour] = content[key][hour].toInt() + incrementFactor;
    this->save();
    console.log(this->station, hour, content[key][hour]);
    if (synced) {
      JSON data("[]");
      data.push_back(hour);
      data.push_back(this->station);
      data.push_back(content[key][hour]);
      data.push_back(MAC::getMac());
      this->call("data", data.toString());
    }
  }
};

namespace PulseCounters {

};
#endif