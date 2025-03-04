#ifndef WS_H__
#define WS_H__
#include <WebSocketsClient.h>
#include <WiFiClientSecure.h>
#include <functional>
#include <event-handler.h>

class WSCtrl: public EventHandler {
  WebSocketsClient webSocket;
  WiFiClientSecure client;
  String data;
  std::function<void()> connectCallback;
public:
  WSCtrl();
  void begin(String ip, uint16_t port);
  void webSocketEvent(WStype_t type, uint8_t * payload, size_t length);
  void loop();
  void write(String data);
  void write(String event, String data);
  void onConnected(std::function<void()> callback);
};
extern WSCtrl wsCtrl;
#endif