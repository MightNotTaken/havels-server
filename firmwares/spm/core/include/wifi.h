#ifndef WIFI_INCLUDE_H__
#define WIFI_INCLUDE_H__
#ifdef ESP8266
#include <ESP8266WiFi.h>
#define WIFI_AUTH_OPEN ENC_TYPE_NONE
#elif defined(ESP32)
#include <WiFi.h>
#endif
#endif