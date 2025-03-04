#include "web_socket.h"
#include <definitions.h>
#include <console.h>
#include <JSON.h>

WSCtrl wsCtrl;

WSCtrl::WSCtrl() {
  connectCallback = nullptr;
}

void WSCtrl::begin(String ip, uint16_t port) {
  webSocket.begin(ip, port, "/");
  webSocket.onEvent([this](WStype_t type, uint8_t * payload, size_t length) {
    webSocketEvent(type, payload, length);
  });
  // webSocket.setAuthorization("user", "Password");
  webSocket.setReconnectInterval(5000);
}

void WSCtrl::onConnected(std::function<void()> callback) {
  this->connectCallback = callback;
}

void WSCtrl::webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      call("disconnected");
      Serial.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
      call("connected");
      break;
    case WStype_TEXT:{
      data = (char *)payload;
      // call("data", String(data));
      JSON eventDataPair(data);
      call(
        eventDataPair["event"].toString(),
        eventDataPair["data"].toString()
      );
    } break;
    case WStype_ERROR:			
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}


void WSCtrl::write(String data) {
  webSocket.sendTXT(data);
}

void WSCtrl::write(String event, String data) {
  JSON eventData;
  eventData["event"] = event;
  eventData["data"] = data;
  webSocket.sendTXT(eventData.toString().c_str());
}

void WSCtrl::loop() {
  webSocket.loop();
}


