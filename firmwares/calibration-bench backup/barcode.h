#ifndef BARCODE_H__
#define BARCODE_H__
#include <Arduino.h>
#include <SoftwareSerial.h>
#include "./core/core.h"
#include "./core/utility/console.h"
#include "./core/utility/event-handler.h"
using namespace Core;
//#define TEST_MODE_2

#ifdef TEST_MODE_2
#define bcserial Serial
#else
SoftwareSerial bcserial(5, 12);
#endif

#define DIRECTION_PIN 13
#define FIRST_PULSE_PIN 22
#define SECOND_PULSE_PIN 21

#include "./core/gpio.h"

class BarcodeReader: public EventHandler<std::function<void(String)>> {
  String values[24];
  InputGPIO* firstPulse;
  InputGPIO* secondPulse;
  TimeoutReference timeoutTracker;
  IntervalReference intervalTracker;
  String buffer;
  int index;
  int maxIndex;
  bool nextReady;
public:

  void begin() {
    bcserial.begin(9600);
    pinMode(DIRECTION_PIN, OUTPUT);
    firstPulse = new InputGPIO(FIRST_PULSE_PIN);
    secondPulse = new InputGPIO(SECOND_PULSE_PIN);
    index = 0;
    nextReady = false;
    firstPulse->onStateLow([this]() {
      console.log("first");
      this->readQRs(1);
    });
    secondPulse->onStateLow([this]() {
      console.log("second");
      this->readQRs(13);
    });
    GPIOs::registerInput(firstPulse);
    GPIOs::registerInput(secondPulse);
    loop();
  }

  void request(int id) {
    digitalWrite(DIRECTION_PIN, 1);
    char ch[4];
    sprintf(ch, "%02d", id);
    bcserial.println(ch);
    console.log("requesting:", ch);
    digitalWrite(DIRECTION_PIN, 0);
    this->on("error", [this](String _) {
      console.log("error in data", _);
      this->next();
    });
    this->on("data", [this](String data) {
      console.log("data received:", data);
      this->next();
    });
  }

  void next() {
    clearTimeout(timeoutTracker);
    delay(200);
    if (index >= maxIndex) {
      return;
    }
    request(index);
    index++;
    
    timeoutTracker = setTimeout([this]() {
      console.log("timeout");
      nextReady = true;
    }, 5000);
  }

  void readQRs(int index) {
    this->index = index;
    this->maxIndex = 12 + index;
    this->next();
  }


  void update(String data) {
    int index = data.substring(0, 2).toInt();
    if (index < 24) {
      this->values[index] = data;
    }
  }

  String read(int index) {
    char data[35];
    sprintf(data, "%02d9867567543344543212345546543", index);
    return String(data);
    if (values[index].length()) {
      String temp = values[index];
      values[index] = "";
      return temp;
    }
    return "";
  }

  bool available(int index) {
    return true;
    return values[index].length();
  }


  void loop() {
    setInterval([this]() {
      if (nextReady) {
        nextReady = false;
        next();
      }
      while (bcserial.available()) {
        char ch = (char)bcserial.read();
        if (ch == '\n') {
          if (buffer.length() == 2) {
            this->call("error", buffer);
            buffer = "";
          } else {
            this->call("data", buffer);
            buffer = "";
          }
          return;
        }
        buffer += ch;
      }
      
    }, 100);
  }
} barcodeReader;
#endif
/*
009867567543344543212345546543
019867567543344543212345546543
029867567543344543212345546543
039867567543344543212345546543
049867567543344543212345546543
059867567543344543212345546543
069867567543344543212345546543
079867567543344543212345546543
089867567543344543212345546543
099867567543344543212345546543
109867567543344543212345546543
119867567543344543212345546543

129867567543344543212345546543
139867567543344543212345546543
149867567543344543212345546543
159867567543344543212345546543
169867567543344543212345546543
179867567543344543212345546543
189867567543344543212345546543
199867567543344543212345546543
209867567543344543212345546543
219867567543344543212345546543
229867567543344543212345546543
239867567543344543212345546543
*/