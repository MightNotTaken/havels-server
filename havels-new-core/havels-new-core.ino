#include <async-core.h>
#include <console.h>
#include <input-gpio.h>
#include <inter-com.h>
#include <database.h>
#include "config.h"
#include <OTA.h>
#include <WiFi.h>
#include <async-core-web-server.h>
#include <mac.h>
#include "wifiController.h"
#include <web_socket.h>
#include <clock.h>
#include <interval.h>

using namespace Intervals;


void setupWifi();
void setupWebSocket();
void setupPulseCounters();

void setup() {
  Serial.begin(115200);
  mainSerial.begin(BRIDGE_LOG_DISABLED);

  database.begin();

  systemClock.setCurrentTime(Time_T("2025/01/01 0:0:0"));

  setInterval([]() {
    console.log(String(hour()));
  }, 1000);
  
  pinMode(19, OUTPUT);
  digitalWrite(19, LOW);
  pinMode(27, OUTPUT);
  digitalWrite(27, HIGH);

  setupWifi();
  setupWebSocket();
  setupPulseCounters();

  mainSerial.on("message", [](String message) {
    wsCtrl.write(message);
  });
  
  wsCtrl.on("utc", [](String timestamp) {
    console.log("timestamp:", timestamp);
    systemClock.setCurrentTime(timestamp);
    console.log("updated time:", systemClock.getCurrentTime());
    JSON ed;
    ed["event"] = "connect";
    ed["data"] = Configuration::getConfiguration();
    wsCtrl.write("ps", ed.toString());
    PulseCounterCtrl::synchronize(hour());
  });
}

void loop() {
  AsyncCore::run();
  InputGPIOs::listen();
  InterComBridges::loop();
  if (wifi.loop()) {
    wsCtrl.loop();
  }
}


void setupWifi() {
  wifi.begin("png", "12345678");
  wifi.on("connected", []() {
    console.log("wifi connected");
  });
  wifi.on("disconnected", []() {
    console.log("wifi disconnected");
  });
}


void setupWebSocket() {
  wifi.on("connected", []() {
    console.log("connecting websocket");
    wsCtrl.begin("192.168.195.84", 3001);
  });
  wsCtrl.on("connected", []() {
    console.log("websocket connected");
  });
  wsCtrl.on("disconnected", []() {
    console.log("websocket disconnected");
  });
}


void setupPulseCounters() {
  for (auto counter: Configuration::PulseCounters::list) {
    PulseCounterCtrl::registerCounter(counter);
  }
  PulseCounterCtrl::beginDataLoop();
}