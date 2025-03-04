#ifndef ASYNC_WIFI_H__
#define ASYNC_WIFI_H__
#include <WiFi.h>
#include <JSON.h>
#include <event-handler.h>
#include <timeout.h>

using namespace Timeouts;
#define WIFI_CREDENTIAL_FILE                "/wifi.config"
#define ALLOW_INSECURE_CONNECTION           true
enum AsyncWifiStatus {
    AW_CONNECTED,
    AW_CONNECTING,
    AW_IDLE,
    AW_SCANNING,
    AW_SCAN_COMPLETE,
    AW_READY_FOR_NEXT,
    AW_PARSE_NETWORKS,
    AW_PROVISION
};

class AsyncWifi: public EventHandler {
    JSON credentials;
    JSON currentCredentials;
    JSON foundNetworks;
    AsyncWifiStatus status;
    bool scaningVerified;
    bool allowOpenNetworks;
    Timeout* connectionTracker;
public:
    AsyncWifi();
    void begin(const JSON& defaultCredentials = "[]", bool allowOpenNetworks = ALLOW_INSECURE_CONNECTION);
    void listen();
    void startScan();
    void connect(const JSON& credential);
    void updateCredential(JSON& old, JSON& newValue);
    void startProvisioning(String ssid, String password, String domain);
    void save();
    void configureRoutes();
    std::pair<int, String> addNewCredential(JSON newCredential);
private:
    void handleScaning();
    void handleConnecting();
    void parseNetworks();
    void prepareNextCredential();
};

extern AsyncWifi wifi;

// namespace WiFiLoop {
//     void begin();
// }

#endif