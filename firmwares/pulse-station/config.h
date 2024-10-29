#include <utility>
#ifndef CONFIG_H__
#define CONFIG_H__
#include "core/JSON.h"
#include "core/mac.h"
#include "core/GPIO/output.h"
#include "core/gpio.h"
#include "core/Wifi.h"
#include "core/web-server.h"
#include "board.h"
#include "core/counter.h"
#include "core/utility/console.h"
#include "core/clock.h"
#include "pulse-counter.h"

#define PRODUCT_NAME               String("LINE_STATION")
#define FIRMWARE_VERSION                  String("1.0.0")
#define DEVICE_TYPE                String("line-station")

namespace Configuration {
  namespace MQTT {
    JSON creds("{}");
    void registerRoute() {
      webServer.post("/api/mqtt/set-credentials", [](Request* request) {
        JSON body = webServer.body();
        JSON response;
        console.log("body", body);
        if (body.contains("server") && body.contains("port") && body.contains("username") && body.contains("password")) {
          Database::writeFile("/mqtt/creds.conf", body.toString());
          creds = body;
          response["message"] = "Credentials successfully updated";
          wifiMQTT.begin(creds);
          return std::make_pair(200, response.toString());
        }
        response["message"] = "Missing parameters";
        JSON expected("[]");
        expected.push_back("server");
        expected.push_back("port");
        expected.push_back("username");
        expected.push_back("password");
        response["expected"] = expected;
        return std::make_pair(400, response.toString());
      });
    }
    void begin() {
      creds["server"] = "192.168.0.123";
      creds["port"] = 1883;
      //creds["username"] = "";
      //creds["password"] = "";
     creds["username"] = "vsms";
       creds["password"] = "VSMS@123";
      
      if (Database::hasFile("/mqtt/creds.conf")) {
        Database::writeFile("/mqtt/creds.conf", creds.toString());
      }
      // if (Database::readFile("/mqtt/creds.conf")) {
      //   creds.resetContent(Database::payload());
      // }
      creds["id"] = MAC::getMac();
      Configuration::MQTT::registerRoute();
    }

    bool isValid() {
      console.log("validating mqtt", creds);
      return creds.contains("server");
    }
   
  };

  namespace Device {
    std::vector<PulseCounter*> pulseCounterList;
    std::vector<std::pair<String, std::vector<int>>> pulseReaders = {
      {"station-9", {PULSE_SOURCE_0, PULSE_SOURCE_1, PULSE_SOURCE_2, PULSE_SOURCE_3, PULSE_SOURCE_4}}
    };
    String toString() {
      JSON json;
      json["mac"] = MAC::getMac();
      json["station"] = DEVICE_TYPE;
      json["version"] = FIRMWARE_VERSION;
      return json.toString();
    }

    void begin() {
      Configuration::MQTT::begin();
      Counters::initialize();
      for (auto [station, gpios]: pulseReaders) {
        PulseCounter* counter = new PulseCounter(station, gpios, SECONDS(3));
        counter->setIncrementFactor(25);
        pulseCounterList.push_back(counter);s
        counter->on("data", [](String response) {
          if (WiFi.status() == WL_CONNECTED) {
            wifiMQTT.publish("hourly-station-count", response.c_str());
          }
        });
      }
      GPIOs::begin();
    }
  };

  void begin() {
    MAC::load();
    OutputGPIO::begin();
    Device::begin();
  }
};
#endif