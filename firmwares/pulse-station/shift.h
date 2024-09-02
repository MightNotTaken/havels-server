#ifndef SHIFT_H__
#define SHIFT_H__

#include "core/JSON.h"
#include "core/mqtt.h"
#include "core/mac.h"

namespace Shifts {
  JSON list("[]");
  void updateShifts(JSON);
  void begin() {
    if (Database::readFile("/shifts.json")) {
      list.resetContent(Database::payload());
    } else {
      JSON defaultContent("[{\"id\":1,\"start\":\"10:00:01\",\"end\":\"12:00:00\",\"name\":\"A\"},{\"id\":2,\"start\":\"12:00:01\",\"end\":\"16:00:00\",\"name\":\"B\"},{\"id\":3,\"start\":\"16:00:01\",\"end\":\"20:00:00\",\"name\":\"C\"}]");
      Shifts::updateShifts(defaultContent);
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
    Database::writeFile("/shifts.json", data.toString());
    console.log(Shifts::list);
    console.log("Shifts updated");
  }

  void listenToChanges() {
    wifiMQTT.listen(MAC::getMac() + "/shift", updateShifts);
    wifiMQTT.listen("all/shift", updateShifts);
    wifiMQTT.listen(MAC::getMac() + "/reset-count", [](String _data) {
      JSON count("{}");
      if (Database::readFile("/shift/count.json")) {
        count.resetContent(Database::payload());
      }
      JSON data(_data);
      String station = data["station"].toString();
      String current = data["current"].toString();
      int value = data[current].toInt();
      count[station][current] = value;
      console.log(data, count);
      Database::writeFile("/shift/count.json", count.toString());
    });
  }

  void increaseCount(String station, String name, int increment) {
    JSON count("{}");
    if (Database::readFile("/shift/count.json")) {
      console.log("payload", Database::payload());
      if (Database::payload().startsWith("{")) {
        count.resetContent(Database::payload());
      }
    }
    if (count["date"] != getDateStamp()) {
      count.resetContent("{}");
      count["date"] = getDateStamp();
    }
    if (!count.contains(station)) {
      count[station] = "{}";
    }
    if (!count[station].contains(name)) {
      count[station][name] = 0;
    }
    count[station][name] = count[station][name].toInt() + increment;
    console.log(count);
    Database::writeFile("/shift/count.json", count.toString());
    JSON response = "{}";
    response["current"] = name;
    response["station"] = station;
    response["mac"] = MAC::getMac();
    response[name] = count[station][name];
    console.log(response);

    if (wifiMQTT.connected()) {
      wifiMQTT.publish("station-count", response.toString().c_str());
    }
  }
};
#endif