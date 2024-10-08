#ifndef SHIFT_H__
#define SHIFT_H__

#include "core/JSON.h"
#include "core/mqtt.h"
#include "core/mac.h"

namespace Shifts {
  JSON list("[]");
  void begin() {
    if (Database::readFile("/shifts")) {
      list.resetContent(Database::payload());
    }
    console.log("Shifts", list);//1310720
  }
  
  uint32_t timeToNumber(String str) {
    int hour;
    int min;
    int sec;
    sscanf(str.c_str(), "%d:%d:%d", &hour, &min, &sec);
    return 3600L * hour + min * 60 + sec; // 1310720
  }

  bool includes(JSON shift, String timing) {
    if (!shift.contains("start") || !shift.contains("end")) {
      return false;
    }
    uint32_t current = timeToNumber(timing);
    return timeToNumber(shift["start"].toString()) <= current && current <= timeToNumber(shift["end"].toString());
  }

  JSON currentShift(String timing) {
    if (list.size()) {
      for (int i=0; i<list.size(); i++) {
        if (includes(list[i], timing)) {
          return list[i];
        }
      }
    }
    return JSON::nullJSON;
  }

  void updateShifts(JSON data) {
    Shifts::list = data;
    Database::writeFile("/shifts", data.toString());
    console.log("Shifts updated");
  }

  void listenToChanges() {
    wifiMQTT.listen(MAC::getMac() + "/shift", updateShifts);
    wifiMQTT.listen("all/shift", updateShifts);
  }

};
#endif