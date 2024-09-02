#include "core/core.h"
#include "core/JSON.h"
#include "core/database.h"
#include "core/Wifi.h"
#include "core/utility/console.h"
#include "core/mqtt.h"
#include "core/mac.h"
#include "config.h"
#include "core/time.h"
#include "core/OTA.h"
#include "shift.h"

using namespace Core;

void setupWiFi();
void setupMQTT();
void initializeOTAEvents();
void setupServerRoutes();

void setup() {
  Serial.begin(9600);
  
  Database::begin();
  
  Configuration::begin();
  Shifts::begin();
  setupWiFi();
  setupMQTT();
  initializeOTAEvents();
  setupServerRoutes();
  
  setInterval([]() {
    //wifi input should be line [{"apName":"tahir 2.4g","apPass":"12345678"}]
    if (Serial.available()) {
      String rawData = Serial.readString();
      rawData.trim();
      JSON data(rawData);
      if (data.size() == 1) {
        Wifi.resetContent(data.toString());
        Wifi.save();
        setTimeout([]() {
          ESP.restart();
        }, 1000);
      } else if (data.size() == 3) {
        Shifts::updateShifts(data);
      }
    }
  }, 1000);
}

void loop() {
  Core::loop();
}

void setupWiFi() {
  Wifi.on("connect", []() {
    console.log("Wifi connecting");
  });
  Wifi.on("scanning", []() {});
  Wifi.on("connecting", []() {});
  Wifi.on("connected", []() {
    console.log("Wifi connected");
    Serial.println(WiFi.localIP());
    wifiMQTT.connect();
    Wifi.turnOnHotspot(PRODUCT_NAME + "_" + MAC::getMac(), "12345678", false);
    webServer.begin(DEVICE_TYPE);
  });
  Wifi.on("provision", []() {
    Wifi.turnOnHotspot(PRODUCT_NAME + "_" + MAC::getMac(), "12345678", false);
    webServer.begin(DEVICE_TYPE);
  });
  Wifi.begin("[{\"apName\":\"fitfab\",\"apPass\":\"12345678\"}]");
  // Wifi.begin("[{\"apName\":\"QRG_VSMS\",\"apPass\":\"vsms@123\"}]");
}

IntervalReference connectionTracker;

void setupMQTT() {
  static String status = "";
  wifiMQTT.on("connected", [](String message) {
    console.log("mqtt connected");
    Timer::listenToUTC();
    OTA::listenToUpdates(DEVICE_TYPE);
    Timer::onSync([](String difference) {
      clearImmediate(connectionTracker);
      console.log("time synchronized");
      for (auto counter: Configuration::Device::pulseCounterList) {
        counter->setHour(hour());
        counter->sync();
        counter->merge();
      }
      console.log(systemClock.getCurrentTime());
    });
    wifiMQTT.listen("/reset-all", [](String response) {
      Counters::resetAll();
    });
    Shifts::listenToChanges();
    connectionTracker = setImmediate([]() {
      wifiMQTT.emit("connect", Configuration::Device::toString());
    }, 2000);
  });
  wifiMQTT.on("failure", [&status](String message) {
    console.log("MQTT disconnected");
    status = "failed";
  });
  if (Configuration::MQTT::isValid()) {
    wifiMQTT.begin(Configuration::MQTT::creds);
  }
  setInterval([&status]() {
    if (status == "failed") {
      status = "";
      if (WiFi.status() == WL_CONNECTED) {        
        wifiMQTT.connect();
      }
    }
  }, 5000);
}


void initializeOTAEvents() {
  OTA::whileProgramming([](int percentage) {
  });
  OTA::onFinished([]() {
    console.log("ota finished");
  });
}


void setupServerRoutes() {
  Wifi.configureRoutes();
}