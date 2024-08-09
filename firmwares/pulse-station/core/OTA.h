#ifndef OTA_H__
#define OTA_H__
#include <Arduino.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <Update.h>
#include <functional>
#include "mqtt.h"
#include "mac.h"
#include "JSON.h"
#include "web-server.h"

namespace OTA {
  uint8_t status;
  void update_started();
  void update_finished();
  void update_progress(int, int);
  void update_error(int);
  std::function<void(int)> statusCallback = nullptr;
  std::function<void()> completionCallback = nullptr;
  int lastPercentage = 0;

  String firmwareURL;

  void begin(String URL) {
    OTA::firmwareURL = URL;
    httpUpdate.onStart(update_started);
    httpUpdate.onEnd(update_finished);
    httpUpdate.onProgress(update_progress);
    httpUpdate.onError(update_error);
  }

  void whileProgramming(std::function<void(int)> callback) {
    OTA::statusCallback = callback;
  }

  void onFinished(std::function<void()> callback) {
    OTA::completionCallback = callback;
  }

  void update_started() {
    Serial.println("CALLBACK:  HTTP update process started");
  }

  void update_finished() {
    Serial.println("CALLBACK:  HTTP update process finished");
    if (OTA::completionCallback) {
      OTA::completionCallback();
    }
  }

  void update_progress(int cur, int total) {
    if (100 * cur / total != lastPercentage) {
      lastPercentage = 100 * cur / total;
      Serial.printf("Writing at 0x%08x... (%d %%)\n", cur, lastPercentage);
      if (OTA::statusCallback) {
        invoke(OTA::statusCallback, lastPercentage);
      }
    }
  }

  void update_error(int err) {
    Serial.printf("CALLBACK:  HTTP update fatal error code %d\n", err);
  }


  bool performUpdate() {
    WiFiClient client;
    t_httpUpdate_return ret = httpUpdate.update(client, OTA::firmwareURL);
    switch (ret) {
      case HTTP_UPDATE_FAILED:
        Serial.printf("HTTP_UPDATE_FAILED Error (%d): %s\n", httpUpdate.getLastError(), httpUpdate.getLastErrorString().c_str());
        return false;

      case HTTP_UPDATE_NO_UPDATES:
        Serial.println("HTTP_UPDATE_NO_UPDATES");
        return false;

      case HTTP_UPDATE_OK:
        Serial.println("HTTP_UPDATE_OK");
        return true;
    }
  }

  void listenToUpdates(String deviceType) {
    console.log("listening to ota updates");
    wifiMQTT.listen(MAC::getMac() + "/ota", [](String response) {
      JSON json(response);
      String url = json["url"].toString();
      String version = json["version"].toString();
      console.log(url, version);
      OTA::begin(url);
      OTA::performUpdate();
    });

    wifiMQTT.listen(deviceType + "/ota", [](String response) {
      JSON json(response);
      String url = json["url"].toString();
      OTA::begin(url);
      OTA::performUpdate();
    });
  }

  void activateOTAInConfigMode() {
    // webServer.post("/update", [](Request* request) {
    //   JSON response;
    //   return std::make_pair(200, response);
    // });
    // ,
    // [](AsyncWebServerRequest* request, String filename, size_t index, uint8_t* data, size_t len, bool final) {
    //   if (!index) {
    //     // Update.runAsync(true);
    //     if (!Update.begin((ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000)) {
    //       Update.printError(Serial);
    //     } else {
    //       update_started();
    //     }
    //   }
    //   if (!Update.hasError()) {
    //     if (Update.write(data, len) != len) {
    //       Update.printError(Serial);
    //     } else {
    //       update_progress(100.0 * len / index, len);
    //     }
    //   }
    //   if (final) {
    //     if (Update.end(true)) {
    //       update_finished();
    //     } else {
    //       Update.printError(Serial);
    //     }
    //   }
    // }
    // );
  }
};

#endif