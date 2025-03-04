#ifndef WIFI_CONTROLLER_H__
#define WIFI_CONTROLLER_H__
#include <Arduino.h>
#include <event-handler.h>
class WifiController: public EventHandler {
    bool connected;
public:
    void begin(String ssid, String password);
    bool loop();
};

extern WifiController wifi;
#endif