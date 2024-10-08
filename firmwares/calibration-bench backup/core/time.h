#ifndef TIME_H__
#define TIME_H__
#include <functional>
#include <TimeLib.h>
#include "utility.h"
#include "core.h"
#include "mqtt.h"
typedef uint32_t TimeReference;
namespace Time {
  uint32_t startedAT;
  uint32_t startSeconds;
  struct OffSet {
    uint8_t hour = 0;
    uint8_t minute = 0;
    OffSet() {}
    OffSet(uint8_t hour, uint8_t minute)
    : hour(hour), minute(minute) {}
  } offset;

  std::function<void(String)> syncCallback;

  void sync(String utc) {
    int hours;
    int minutes;
    int seconds;
    int day;
    int month;
    int year;
    sscanf(utc.c_str(), "%d:%d:%d", &hours, &minutes, &seconds);
    utc = utc.substring(utc.indexOf('_') + 1);
    sscanf(utc.c_str(), "%d-%d-%d", &year, &month, &day);
    setTime(hours + Time::offset.hour, minutes + Time::offset.minute, seconds, day, month, year);
    startedAT = now();
    startSeconds = millis() / 1000;
    invoke(syncCallback, getTimeDateStamp());
  }

  void onSync(std::function<void(String)> callback) {
    Time::syncCallback = callback;
  }

  void listenToUTC() {
    console.log("listening to utc");
    wifiMQTT.listen(MAC::getMac() + "/utc", [](String response) {
      console.log("utc", response);
      Time::sync(response);
    });
  }

  String standardize(String timestamp) {
    if (timestamp.startsWith("1970")) {
      return nowToStamp(stampToNow(timestamp) + startedAT - startSeconds);
    }
    return timestamp;
  }
};
#endif