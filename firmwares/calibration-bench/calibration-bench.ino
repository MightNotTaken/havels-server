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
#include "data.h"
using namespace Core;

void setupWiFi();
void setupMQTT();
void initializeOTAEvents();
void setupServerRoutes();

void setup() {
  Serial.begin(9600);
  
  Database::begin();
  DataSource::begin();
  
  Configuration::begin();
  setupWiFi();
  setupMQTT();
  initializeOTAEvents();
  setupServerRoutes();
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
    });
    wifiMQTT.listen("/reset-all", [](String response) {
      Counters::resetAll();
    });
    wifiMQTT.listen(MAC::getMac() + "/bench-id", [](String id) {

    });
    connectionTracker = setImmediate([]() {
      wifiMQTT.emit("calib:connect", Configuration::Device::toString());
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