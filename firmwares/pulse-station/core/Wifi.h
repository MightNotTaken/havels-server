#ifndef WIFI_H__
#define WIFI_H__
#include "database.h"
#include "utility/console.h"
#include "include/wifi.h"
#include "utility/string-matcher.h"
#include "utility/event-handler.h"
#include <map>
#include <functional>
#include "web-server.h"


using namespace Core;

enum {
  CONNECT_NOW
};

int printer = 0;
class Wifi_T : public JSON, public EventHandler<std::function<void()>> {
  IntervalReference scanner;
  IntervalReference connector;
  TimeoutReference connectionTimeout;
  bool scanningCompleted;
  int mode;
  JSON matchedCredentials;
  bool paused;
  int scanAttempts;
  bool justScanned;
public:
  Wifi_T();
  void update(std::function<bool(JSON&)>, const JSON&);
  void begin(const JSON& = "[]");
  void updateLastConnected(JSON&);
  void save();
  void connect(wifi_mode_t = WIFI_AP_STA);
  void scan();
  void stopScan();
  void loop();
  void pauseLoop() {
    console.log("loop paused");
    paused = true;
  }
  void restartLoop() {
    mode = WIFI_STA;
    console.log("loop restarted");
    paused = false;
  }
  JSON scanCompletionCallback();
  void initializeCredentials(const JSON&);
  void resetCurrentCredentials();
  void turnOnHotspot(String, String, bool);
  int getMode();
  void stopAllWifiThings();
  void configureRoutes();
  int getScanAttempts();
};

JSON Wifi_T::scanCompletionCallback() {
  if (WiFi.scanComplete() == WIFI_SCAN_FAILED) {
    call("scan-failed");
    return nullJSON;
  }
  int total = WiFi.scanComplete();
  console.log(total);
  JSON matched = "[]";
  for (int i = 0; i < total; i++) {
    float percentMatch;
    console.log(i+1, WiFi.SSID(i));
    if (WiFi.encryptionType(i) == WIFI_AUTH_OPEN) {
      /*JSON match;
      match["RSSI"] = WiFi.RSSI(i);
      match["apName"] = WiFi.SSID(i);
      match["match"] = WiFi.SSID(i);
      match["apPass"] = "";
      match["percent"] = 100;
      matched.push_back(match);*/
    } else {
      auto match = this->find([i, &percentMatch](JSON& wifi) {
        StringMatcher matcher(wifi["apName"].toString(), WiFi.SSID(i));
        percentMatch = matcher.getPercentage();
        return percentMatch > 80;
      });
      if (match) {
        match["RSSI"] = WiFi.RSSI(i);
        match["match"] = WiFi.SSID(i);
        match["percent"] = percentMatch;
        matched.push_back(match);
      }
    }
  }
  matched.sort([](JSON* a, JSON* b) {
    return (*a)["RSSI"].toInt() > (*b)["RSSI"].toInt();
  });
  return matched;
}

void Wifi_T::initializeCredentials(const JSON& wifiList = "[]") {
  this->matchedCredentials = wifiList;
}

void Wifi_T::resetCurrentCredentials() {
  this->matchedCredentials = nullJSON;
}

Wifi_T::Wifi_T() {
  scanAttempts = 0;
  resetCurrentCredentials();
}

void Wifi_T::begin(const JSON& defaultContent) {
  if (!Database::hasFile("/_wifi.conf")) {
    Database::writeFile("/_wifi.conf", defaultContent.toString());
  }
  if (Database::readFile("/_wifi.conf")) {
    console.log("Credentials loaded from database", Database::payload());
    if (JSON::isJSON(Database::payload())) {
      this->resetContent(Database::payload());
    } else {
      Database::writeFile("/_wifi.conf", defaultContent.toString());
      this->resetContent(defaultContent.toString());
    }
  } else {
    this->resetContent(defaultContent.toString());
  }
  if (this->size()) {
    int index = 0;
    auto lastConnected = this->map([&index](JSON wifi) {
      wifi["match"] = wifi["apName"];
      wifi["index"] = index ++;
      return wifi;
    });
    lastConnected.sort([](JSON* a, JSON* b) {
      return (*a)["index"].toInt() - (*b)["index"].toInt();
    });
    console.log("lastConnected", lastConnected);
    this->initializeCredentials(lastConnected);
  }
  this->loop();
}

void Wifi_T::update(std::function<bool(JSON&)> predicate, const JSON& newValue) {
  JSON::update(predicate, newValue);
  this->save();
}

void Wifi_T::save() {
  if (!Database::writeFile("/_wifi.conf", this->toString())) {
    console.log("unable to save to database");
  }
}

void Wifi_T::updateLastConnected(JSON& current) {
  if (!current["apPass"].toString().length()) {
    return;
  }
  this->remove([&current](JSON wifi) {
    return current["apName"].toString() == wifi["apName"].toString();
  });
  while (this->size() > 4) {
    this->remove(0);
  }
  this->push_back(current);
  this->save();
}

void Wifi_T::connect(wifi_mode_t mode) {
  scanAttempts = 0;
  WiFi.mode(mode);
  call("connect");
  this->mode = mode;
  if (this->matchedCredentials) {
    if (justScanned) {
      justScanned = false;
      WiFi.begin("", "");
      WiFi.disconnect(true);
    }
    auto match = matchedCredentials.front();
    if (!match) {
      resetCurrentCredentials();
      return;
    }
    this->pauseLoop();
    auto ssid = match["apName"].toString();
    auto matchedSsid = match["match"].toString();
    auto percent = match["percent"].toFloat();
    auto password = match["apPass"].toString();
    console.log("connecting to", matchedSsid, "using password", password);
    WiFi.begin(matchedSsid, password);
    clearInterval(connector);
    clearTimeout(connectionTimeout);
    connectionTimeout = setTimeout([this, percent, matchedSsid]() {
      call("failed");
      console.log("timed out");      
      this->matchedCredentials.remove(0);
      this->restartLoop();
    }, SECONDS(15));
    connector = setInterval([this, ssid, password, match, percent, matchedSsid]() {
      printer ++;
      if (printer % 10 == 0) {
        call("connecting");
      }
      switch(WiFi.status()) {
        case WL_CONNECTED: {
          JSON newData;
          newData["apName"] = matchedSsid;
          newData["apPass"] = password;
          if (password.length()) {
            if (matchedSsid != ssid) {
              this->findAndReplace([ssid](JSON& wifi) {
                return wifi["apName"].toString() == ssid;
              }, newData);
              this->save();
            }
          }
          this->updateLastConnected(newData);
          this->resetCurrentCredentials();
          this->restartLoop();
          call("connected");          
        } break;
        case WL_IDLE_STATUS:
        case WL_DISCONNECTED: break;
        default: {
          console.log(WiFi.status());
          call("failed");
          this->matchedCredentials.remove(0);
          this->restartLoop();
        }
      }
    }, 100);
  }
}

void Wifi_T::stopScan() {
  if (scanner) {
    clearInterval(scanner);
  }
}

int Wifi_T::getScanAttempts() {
  return scanAttempts;
}

void Wifi_T::scan() {
  this->pauseLoop();
  scanningCompleted = false;
  stopScan();
  this->mode = WIFI_STA;
  WiFi.disconnect(true);
  WiFi.setScanMethod(WIFI_ALL_CHANNEL_SCAN);
  WiFi.scanNetworks(true);
  call("scan-start");
  scanAttempts ++;
  scanner = setImmediate([this]() {
    printer ++;
    if (printer % 10 == 0) {
      call("scanning");
    }
    if (WiFi.scanComplete() == WIFI_SCAN_RUNNING) {
      return;
    }
    uint32_t start = millis();
    while (WiFi.scanComplete() == WIFI_SCAN_FAILED && millis() - start < 5000) {
      delay(1);
    }
    call("scan-end");
    if (WiFi.scanComplete() != WIFI_SCAN_FAILED) {
      JSON match = this->scanCompletionCallback();
      justScanned = true;
      if (match.size()) {
        this->initializeCredentials(match);
      } else {
        call("no-network");
      }
    }
    this->restartLoop();
  }, 100);
}

void Wifi_T::loop() {
  paused = false;
  setInterval([this]() {
    if (this->paused) {
      return;
    }
    if (this->connectionTimeout) {
      clearTimeout(this->connectionTimeout);
    }
    if (this->scanner) {
      this->stopScan();
    }
    if (this->connector) {
      clearInterval(connector);
    }
    switch (WiFi.status()) {
      case WL_CONNECTED: 
        break;
      case WL_DISCONNECTED: call("disconnect");
      default: {
        if (this->matchedCredentials && this->matchedCredentials.size()) {
          console.log(this->matchedCredentials);
          this->connect();
        } else {
          this->scan();
        }
      }
    }
  }, 100);
}

void Wifi_T::turnOnHotspot(String ssid, String password, bool suspendWifiActivities = true) {
  scanAttempts = 0;
  console.log("turn on hotspot caleld");
  if (suspendWifiActivities) {
    console.log("wifi activities suspended");
    this->stopAllWifiThings();
    this->pauseLoop();
    this->stopScan();
    WiFi.mode(WIFI_AP);
    mode = WIFI_AP;
  }
  console.log("turning on hotspot");
  WiFi.softAP(ssid.c_str(), password.c_str());
}

int Wifi_T::getMode() {
  return this->mode;
}

void Wifi_T::stopAllWifiThings() {
  stopScan();
  clearInterval(connector);
  clearTimeout(connectionTimeout);
  this->pauseLoop();
  WiFi.disconnect(true);
}

void Wifi_T::configureRoutes() {
  clearTimeout(connectionTimeout);
  webServer.get("/api/wifi/add", [this](Request* request) {
    JSON response;
    int code = 200;
    String apName = request->getParam("apName")->value();
    String apPass = request->getParam("apPass")->value();
    console.log(apName, apPass);
    if (!apName.length()) {
      response["message"] = "Invalid apName";
      response["type"] = "error";
      code = 400;
      return std::make_pair(code, response.toString());
    }
    if (apPass.length() && apPass.length() < 8) {
      response["message"] = "Password length should be atleast 8";
      response["type"] = "error";
      code = 400;
      return std::make_pair(code, response.toString());
    }
    JSON wifi;
    wifi["apName"] = apName;
    wifi["apPass"] = apPass;
    this->push_back(wifi);
    if (this->size() > 10) {
      this->remove(0);
    }
    this->save();
    response["message"] = "connection okay";
    response["type"] = "success";
    setTimeout([]() {
      ESP.restart();
    }, SECONDS(2));
    return std::make_pair(code, response.toString());
  });
  webServer.get("/api/wifi/id", [this](Request* request) {
    JSON response;
    int code = 200;
    console.log("/delete called");
    if (request->hasParam("id")) {
      int id = request->getParam("id")->value().toInt();
      this->remove(id);
      this->save();
      code = 200;
      response["message"] = "okay";
      response["type"] = "success";
    } else {
      code = 400;
      response["message"] = "id expected";
      response["type"] = "error";
    }
    
    return std::make_pair(code, response.toString());
  });
  webServer.get("/api/wifi/config", [this](Request* request) {
    JSON response = this->toString();
    console.log("/config called");
    return std::make_pair(200, response.toString());
  });
  webServer.post("/api/wifi/config", [this](Request* request) {
    JSON response = this->toString();
    return std::make_pair(200, response.toString());
  });
}

Wifi_T Wifi;
#endif