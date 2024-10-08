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

namespace DataSource {
  String data;
  std::function<void(String&, String&)> onDataChange;
  String barcode;

  void onData(std::function<void(String&, String&)> callback) {
    DataSource::onDataChange = callback;
  }
  
  void begin() {
    setInterval([]() {
      while (serial.available()) {
        char ch = Serial.read();
        if (ch == '\r') {
          continue;
        }
        if (ch == '\n') {
          DataSource::onDataChange(DataSource::barcode, DataSource::data);
          DataSource::data = "";
          continue;
        }
        if (ch == '~') {
          DataSource::data ="";
          continue;
        }
        if (ch == '|') {
          DataSource::barcode = DataSource::data;
          DataSource::barcode.trim();
          DataSource::data = "";
        }

        DataSource::data += ch;
      }
    }, 100);
  }
};
#endif