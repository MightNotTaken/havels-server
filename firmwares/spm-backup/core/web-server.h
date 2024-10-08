#ifndef WEB_SERVER_H__
#define WEB_SERVER_H__
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#endif
#include <functional>
#include <utility>
#include "JSON.h"
#include <WiFi.h>
#include <ESPmDNS.h>
#include "JSON.h"
#define Request AsyncWebServerRequest
typedef std::function<
  std::pair<
    int,
    const String >(Request *) >
  ServerPredicate;
class CoreWebServer : public AsyncWebServer {
  int port;
  JSON _body;
  JSON _query;
public:
  CoreWebServer(int);
  void get(String, ServerPredicate);
  void post(String, ServerPredicate, std::function<void(AsyncWebServerRequest*, String, size_t, uint8_t*, size_t, bool)> = NULL);
  void begin(String);
  void stop();
  JSON body();
  JSON query();
} webServer(80);

CoreWebServer::CoreWebServer(int port)
  : AsyncWebServer(port) {}

void CoreWebServer::get(String route, ServerPredicate callback) {
  AsyncWebServer::on(route.c_str(), HTTP_GET, [callback, this, route](Request *request) {
    this->_query = JSON("{}");
    for (size_t i = 0; i < request->params(); i++) {
      String key = request->getParam(i)->name();
      String value = request->getParam(i)->value();
      this->_query[key] = value;
    }
    auto [code, data] = callback(request);
    AsyncWebServerResponse *response = request->beginResponse(code, "application/json", data.c_str());
    response->addHeader("Access-Control-Allow-Origin", "*");
    request->send(response);
  });
}

void removeExtraChars(char* str) {
    int len = strlen(str);
    int index = 0;
    int prev_space = 0;  // Flag to track previous space
    for (int i = 0; i < len; i++) {
        if (str[i] != ' ' && str[i] != '\t' && str[i] != '\n' && str[i] != '\r') {
            str[index++] = str[i];
            prev_space = 0;
        } else {
            // Only include one space if it's not a consecutive space
            if (!prev_space) {
                str[index++] = ' ';
                prev_space = 1;
            }
        }
    }
    // Remove trailing space if present
    if (index > 0 && str[index - 1] == ' ') {
        index--;
    }
    str[index] = '\0';  // Null-terminate the cleaned string
}

void CoreWebServer::post(String route, ServerPredicate callback, std::function<void(AsyncWebServerRequest*, String, size_t, uint8_t*, size_t, bool)> filehandler) {
  AsyncWebServer::on(
    route.c_str(), HTTP_POST, [route, this, callback](Request *request) {
      this->_query = JSON("{}");
      for (size_t i = 0; i < request->params(); i++) {
        String key = request->getParam(i)->name();
        String value = request->getParam(i)->value();
        this->_query[key] = value;
      }
      auto [code, data] = callback(request);
      AsyncWebServerResponse *response = request->beginResponse(code, "application/json", data.c_str());
      response->addHeader("Access-Control-Allow-Origin", "*");
      request->send(response);
    },
    filehandler, [this](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
      if (index == 0) {
        if (data[0] == '{' || data[0] == '[') {
          while (len >= 0) {
            if (data[len] == '}' || data[len] == ']') {
              break;
            }
            data[len] = '\0';
            len --;
          }
        }
        Serial.println((char*)data);
        this->_body.resetContent((char*)data);
        Serial.println(this->_body);
      }
    });
}

void CoreWebServer::stop() {
  AsyncWebServer::end();
  MDNS.end();
}

void CoreWebServer::begin(String domain) {
  this->end();
  Serial.print(ESP.getFreeHeap());
  Serial.print(" ");
  AsyncWebServer::begin();
  Serial.println(ESP.getFreeHeap());
  
  _query = JSON::nullJSON;
  if (!MDNS.begin(domain.c_str())) {
    console.log("unable to grab mdns");
  } else {
    console.log("grabbed mdns");
  }
}

JSON CoreWebServer::body() {
  JSON bd = this->_body;
  this->_body = JSON::nullJSON;
  return bd;
}

JSON CoreWebServer::query() {
  JSON qu = this->_query;
  this->_query = JSON::nullJSON;
  return qu;
}
#endif