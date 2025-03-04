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

using namespace Core;

void setupWiFi();
void setupMQTT();
void initializeOTAEvents();
void setupServerRoutes();

void setup() {
  Serial.begin(9600);
  
  Database::begin();
  
  Configuration::begin();
  // setupWiFi();
  setupMQTT();
  initializeOTAEvents();
  setupServerRoutes();
}
bool wifiConnected = true;
void loop() {
  Core::loop();
  if (WiFi.status() == WL_CONNECTED && !wifiConnected) {
    wifiConnected = true;
    Serial.println("Connected to wifi");
    
    console.log("Wifi connected");
    Serial.println(WiFi.localIP());
    wifiMQTT.connect();
    Wifi.turnOnHotspot(PRODUCT_NAME + "_" + MAC::getMac(), "12345678", false);
    webServer.begin(DEVICE_TYPE);
  }
  if (WiFi.status() != WL_CONNECTED && wifiConnected) {
    wifiConnected = false;
    WiFi.begin("", "");
    Serial.println("Disconnected from wifi");
  }
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
  //Wifi.begin("[{\"apName\":\"fitfab\",\"apPass\":\"12345678\"}]");
 
 
 
  // Wifi.begin("[{\"apName\":\"heleo master\",\"apPass\":\"heleo@master\"}]");
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
      console.log("reset called");
      Counters::resetAll();
    });
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