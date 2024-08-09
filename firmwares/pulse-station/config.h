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
#include "shift.h"

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
      creds["server"] = "192.168.79.60";
      creds["port"] = 1883;
      creds["username"] = "tahir";
      creds["password"] = "AlMustafa@786";
      
      if (Database::hasFile("/mqtt/creds.conf")) {
        Database::writeFile("/mqtt/creds.conf", creds.toString());
      }
      if (Database::readFile("/mqtt/creds.conf")) {
        creds.resetContent(Database::payload());
      }
      creds["id"] = MAC::getMac();
      Configuration::MQTT::registerRoute();
    }

    bool isValid() {
      return creds.contains("server");
    }
   
  };
  namespace Device {
    std::vector<std::pair<String, int>> pulseReaders = {
      // {"station-1", PULSE_SOURCE_0},
      // {"station-2", PULSE_SOURCE_0},
      // {"station-3", PULSE_SOURCE_0},
      // {"station-4", PULSE_SOURCE_0},
      {"station-5", PULSE_SOURCE_0}
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
      for (auto [station, gpio]: pulseReaders) {
        InputGPIO* input = new InputGPIO(gpio);
        input->onStateLow([station]() {          
          JSON shift = Shifts::currentShift(getTimeStamp());
          if (shift) {
            String name = shift["name"].toString();
            if (station == "station-5") {
              static TimeoutReference timeout;
              clearTimeout(timeout);
              timeout = setTimeout([station, name, shift]() {
                console.log("updating count");
                Shifts::increaseCount(station, name, 1);
              }, 3000);
            } else {
              Shifts::increaseCount(station, name, 1);
            }
          }
        });
        GPIOs::registerInput(input);
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