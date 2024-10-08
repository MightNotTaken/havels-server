#ifndef WEB_SERVER_INCLUDE_H__
#define WEB_SERVER_INCLUDE_H__
#ifdef ESP32
#include <WebServer.h>
typedef WebServer WebServer_T;
#elif defined(ESP8266)
#include <ESP8266WebServer.h>
typedef ESP8266WebServer WebServer_T;
#endif
#endif