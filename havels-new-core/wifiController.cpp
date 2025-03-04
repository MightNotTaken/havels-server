#include "wifiController.h"
#include <WiFi.h>

WifiController wifi;

void WifiController::begin(String ssid, String password) {
    connected = false;
    WiFi.begin(ssid.c_str(), password.c_str());
}

bool WifiController::loop() {
    if (WiFi.status() == WL_CONNECTED) {
        if (!connected) {
            connected = true;
            call("connected");
        }
    } else {
        if (connected) {
            connected = false;
            call("disconnected");
        }
    }
    return connected;
}
