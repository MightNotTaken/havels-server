#ifndef HTTP_CLIENT_INCLUDE_H__
#define HTTP_CLIENT_INCLUDE_H__
#ifdef ESP32
#include <HTTPClient.h>
#elif defined(ESP8266)
#include <ESP8266HTTPClient.h>
#endif
#endif