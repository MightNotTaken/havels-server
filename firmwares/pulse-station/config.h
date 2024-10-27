#ifndef CONFIG_H__
#define CONFIG_H__
#include <utility>
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
      creds["server"] = "192.168.100.150";
      creds["port"] = 1883;
      creds["username"] = "";
      creds["password"] = "";
      // creds["username"] = "vsms";
      // creds["password"] = "VSMS@123";
      
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
      {"station-1", {PULSE_SOURCE_0, PULSE_SOURCE_1, PULSE_SOURCE_2, PULSE_SOURCE_3}},
      {"station-2", {PULSE_SOURCE_1}},
      {"station-3", {PULSE_SOURCE_2}},
      {"station-4", {PULSE_SOURCE_3}},
      // {"station-5", PULSE_SOURCE_0}
    };
    String toString() {
      JSON json;
      json["mac"] = MAC::getMac();
      return json.toString();
    }

    void begin() {
      setTimeout([]() {
        Configuration::MQTT::begin();
        Counters::initialize();
        for (auto [station, gpios]: pulseReaders) {
          PulseCounter* counter = new PulseCounter(station, gpios);

          counter->setIncrementFactor(25); // count increase on each pulse


          pulseCounterList.push_back(counter);
          counter->on("data", [](String response) {
            console.log(response);
            if (WiFi.status() == WL_CONNECTED) {
              wifiMQTT.publish("hourly-station-count", response.c_str());
            }
          });
        }
        GPIOs::begin();
      }, 1000);
    }
  };

  void begin() {
    MAC::load();
    OutputGPIO::begin();
    Device::begin();
  }
};
#endif