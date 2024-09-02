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

#define PRODUCT_NAME               String("CALIBRATION_BENCH")
#define FIRMWARE_VERSION           String("1.0.0")
#define DEVICE_TYPE                String("bench-0")
#define DEVICE_STATION             String("bench-0")

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
      creds["server"] = "192.168.137.1";
      creds["port"] = 1883;
      creds["username"] = "tahir";
      creds["password"] = "AlMustafa@786";
      
      if (!Database::hasFile("/mqtt/creds.conf")) {
        Database::writeFile("/mqtt/creds.conf", "{}");
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
    String toString() {
      JSON json;
      json["mac"] = MAC::getMac();
      json["station"] = DEVICE_TYPE;
      json["version"] = FIRMWARE_VERSION;
      return json.toString();
    }

    void begin() {
      Configuration::MQTT::begin();
    }
  };

  void begin() {
    MAC::load();
    OutputGPIO::begin();
    Device::begin();
  }
};
#endif