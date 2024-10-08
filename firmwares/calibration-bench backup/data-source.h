#ifndef DATA_SOURCE_H__
#define DATA_SOURCE_H__
#include <SoftwareSerial.h>
#include "core/core.h"
#include "core/JSON.h"
#include <functional>
using namespace Core;

#define TEST_MODE

#ifdef TEST_MODE
#define serial Serial
#else
SoftwareSerial serial(10, 11);
#endif

class PodData {
  String verificationString;
  String calibrationString;
  String barcode;
  uint8_t index;

public:
  void begin(uint8_t index) {
    this->index = index;
  }

  void flush() {
    verificationString = "";
    calibrationString = "";
  }

  bool completed() {
    return verificationString.length() && calibrationString.length();
  }

  bool update(String& data) {
    if (data.startsWith("ver_")) {
      verificationString = data.substring(data.indexOf("_") + 1);
    } else if (data.startsWith("cal_")) {
      calibrationString = data.substring(data.indexOf("_") + 1);
    }
    data = "";
    return this->completed();
  }

  void setBarcodeData(String barCode) {
    barcode = barCode;
    verificationString.replace("__BAR__", barCode);
    calibrationString.replace("__BAR__", barCode);
  }

  int getIndex() {
    return index;
  }

  String toString() {
    JSON data("{}");
    data["index"] = index;
    data["ver"] = verificationString;
    data["bar"] = barcode;
    data["cal"] = calibrationString;
    return data.toString();
  }
};

namespace DataSource {
  PodData list[24];
  String data;
  std::function<void(PodData&)> onDataChange;
  int getPodIndex(String data) {
    int index;
    sscanf(data.substring(data.indexOf("_") + 1).c_str(), "%d", &index);
    return index;
  }

  void parse() {
    int index = DataSource::getPodIndex(DataSource::data);
    console.log(DataSource::data);
    // if (index >= 24) {
    //   console.log("Invalid data", DataSource::data);
    // } else {
    //   DataSource::list[index].update(DataSource::data);
    //   if (DataSource::list[index].completed()) {
    //     DataSource::onDataChange(DataSource::list[index]);
    //     DataSource::list[index].flush();
    //   }
    // }
    DataSource::data = "";        
  }

  void onData(std::function<void(PodData&)> callback) {
    DataSource::onDataChange = callback;
  }
/*
~ver_10/24B02,16.0,__BAR__,5,VISHAL,kkkk,Verification,1,40.5,40.5,40.5,System,18.9,10.0,20.0,25.0,12.7,OK
~cal_10/24B02,16.0,__BAR__,6,scr,HG,Calibration,1,41.0,41.0,41.0,System,19.8,13.0,20.0,25.0,15.3,OK
*/
  void begin() {
    for (int i=0; i<24; i++) {
      DataSource::list[i].begin(i);
    }
    setInterval([]() {
      while (Serial.available()) {
        char ch = Serial.read();
        if (ch == '#') {
          DataSource::parse();
          DataSource::data = "";
          continue;
        }
        DataSource::data += ch;
      }
    }, 100);
  }
};
#endif