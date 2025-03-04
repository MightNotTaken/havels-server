#include <mac.h>
#include <WiFi.h>

String mac() {
    static String response = "";
    if (response.length()) {
        return response;
    }
    char address[20];
    WiFi.macAddress().toCharArray(address, 18);
    response = String(address);
    response.replace(":", "");
    return response;
}