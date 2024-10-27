#ifndef WIFI_MQTT_H__
#define WIFI_MQTT_H__

#include "JSON.h"
#include <map>
#include <functional>
#include "core.h"
#include "./utility/event-handler.h"
#include <PubSubClient.h>
#include "web-server.h"


class WiFiMQTT : public EventHandler<std::function<void(String)>>, public PubSubClient {
  String server;
  int port;
  String username;
  String password;
  WiFiClient wifiClient;
  bool paused;
  String id;
  IntervalReference connectionTracker;
public:
  WiFiMQTT();
  void begin(JSON);
  void connect();
  void startLoop();
  void callback(char*, byte*, unsigned int);
  void listen(String, std::function<void(String)>);
  void unsubscribe(String);
  void emit(String, String);
} wifiMQTT;

WiFiMQTT::WiFiMQTT() : PubSubClient(wifiClient) {
  paused = false;
}

void WiFiMQTT::begin(JSON creds) {
  this->server = creds["server"].toString();
  this->port = creds["port"].toInt();
  this->username = creds["username"].toString();
  this->password = creds["password"].toString();
  this->id =  MAC::getMac();
  this->setServer(this->server.c_str(), this->port);
  this->setCallback([this](char* event, byte* payload, unsigned int length) {
    this->callback(event, payload, length);
  });
  this->startLoop();
}

void WiFiMQTT::connect() {
  if (!server.length()) {
    console.log("MQTT credentials not valid");
    return;
  }
  console.log("connecting to mqtt with userid", id, username, password, "on", server, port);
  if (PubSubClient::connect(
    (char *)id.c_str(),
    (char *)username.c_str(),
    (char *)password.c_str()
  )) {
    call("connected", "Connected to MQTT Broker");
    clearInterval(connectionTracker);
  } else {
    call("failure", "MQTT unable to connect");
  }
}


void WiFiMQTT::callback(char* event, byte* payload, unsigned int length) {
  String data = "";
  for (int i = 0; i < length; i++) {
    char ch = (char)payload[i];
    data += ch;
  }
  call(String("event:") + event, data);
}

void WiFiMQTT::startLoop() {
  setInterval([this]() {
    if (this->paused && this->connected()) {
      this->paused = false;
      clearInterval(connectionTracker);
    }
    if (this->paused) {
      return;
    }
    if (!this->connected()) {
      this->paused = true;
      if (WiFi.isConnected()) {
        call("failure", "MQTT Connection failed");
        clearInterval(connectionTracker);
        connectionTracker = setImmediate([this]() {
          if (this->connected()) {
            this->connect();
          }
        }, SECONDS(1));
      }
    }
    PubSubClient::loop();
  }, 100);
}

void WiFiMQTT::emit(String event, String data) {
  this->publish(event.c_str(), data.c_str());
}

void WiFiMQTT::listen(String event, std::function<void(String)> callback) {
  this->on(String("event:") + event, callback);
  PubSubClient::subscribe(event.c_str());
}

void WiFiMQTT::unsubscribe(String event) {
  PubSubClient::unsubscribe(event.c_str());
  EventHandler::unsubscribe(String("event:") + event);
}
#endif
