#include "async-wifi.h"
#include <database.h>
#include <interval.h>
#include <console.h>
#include <repeater.h>
#include <string-matcher.h>
#include <async-core-web-server.h>

using namespace Repeaters;
using namespace Timeouts;
using namespace Intervals;

AsyncWifi wifi;

AsyncWifi::AsyncWifi() {
    this->connectionTracker = nullptr;
}

void AsyncWifi::begin(const JSON& defaultCredentials, bool allowOpenNetworks) {
    this->allowOpenNetworks = allowOpenNetworks;
    this->foundNetworks.load("[]");
    if (!database.hasFile(WIFI_CREDENTIAL_FILE)) {
        this->credentials = defaultCredentials;
        this->save();
    }
    if (database.readFile(WIFI_CREDENTIAL_FILE)) {
        this->credentials.load(database.payload());
    }
    console.log(this->credentials);
    if (this->credentials.size()) {
        for (int i=0; i<this->credentials.size(); i++) {
            if (this->credentials[i]["last"].toInt()) {
                this->foundNetworks.push_back(this->credentials[i]);
                this->status = AsyncWifiStatus::AW_READY_FOR_NEXT;
                break;
            }
        }
        if (!this->foundNetworks.size()) {
            this->status = AsyncWifiStatus::AW_IDLE;
        }
    } else {
        this->call("provision");
    }
}

void AsyncWifi::startScan() {
    this->status = AsyncWifiStatus::AW_SCANNING;
    this->call("scan");
    this->scaningVerified = false;
    WiFi.disconnect(true);
    WiFi.setScanMethod(WIFI_ALL_CHANNEL_SCAN);
    WiFi.scanNetworks(true);
}

void AsyncWifi::handleScaning() {
    switch (WiFi.scanComplete()) {
        case WIFI_SCAN_FAILED: {
            static uint32_t start = millis();
            if (!scaningVerified) {
                start = millis();
                scaningVerified = true;
            }
            if (millis() - start > 2000) {
                this->status = AsyncWifiStatus::AW_IDLE;
                this->call("scan-failed");
            }
        } break;
        case WIFI_SCAN_RUNNING: {
            // console.log("scan running");
        } break;
        default: {
            scaningVerified = true;
            this->status = AsyncWifiStatus::AW_PARSE_NETWORKS;
        }
    }
}

void AsyncWifi::handleConnecting() {
    switch (WiFi.status()) {
        case WL_CONNECTED: {
            clearTimeout(connectionTracker);
            this->status = AsyncWifiStatus::AW_CONNECTED;
            this->foundNetworks.clear();
            this->save();
            this->call("connected", this->currentCredentials.toString());
        } break;
        case WL_CONNECT_FAILED: {
            clearTimeout(connectionTracker);
            this->status = AsyncWifiStatus::AW_READY_FOR_NEXT;
            this->call("unable-to-connect", this->currentCredentials.toString());
        } break;
        case WL_NO_SSID_AVAIL: {
            clearTimeout(connectionTracker);
            this->status = AsyncWifiStatus::AW_READY_FOR_NEXT;
            this->call("unable-to-connect", this->currentCredentials.toString());
        } break;
        case WL_DISCONNECTED: {
        } break;
    }
}

void AsyncWifi::parseNetworks() {
    int total = WiFi.scanComplete();
    this->foundNetworks.clear();
    this->foundNetworks.load("[]");
    for (int i=0; i<total; i++) {
        JSON network = JSON::nullJSON;
        if (WiFi.encryptionType(i) == WIFI_AUTH_OPEN && allowOpenNetworks) {
            network["ssid"] = WiFi.SSID(i);
            network["apName"] = WiFi.SSID(i);
            network["password"] = "";
        } else {
            auto match = this->credentials.find([i](JSON& wifi) {
                StringMatcher matcher(wifi["apName"].toString(), WiFi.SSID(i));
                return matcher.getPercentage() > 80;
            });
            if (match) {
                network["apName"] = match["apName"];
                network["ssid"] = WiFi.SSID(i);
                network["password"] = match["apPass"].toString();
            }
        }
        if (network) {
            this->foundNetworks.push_back(network);
        }
    }
    if (this->foundNetworks.size()) {
        this->status = AsyncWifiStatus::AW_READY_FOR_NEXT;
    } else {
        this->status = AsyncWifiStatus::AW_IDLE;
    }
}

void AsyncWifi::connect(const JSON& credential) {
    this->currentCredentials = credential;
    this->call("connect", credential.toString());
    WiFi.disconnect(true);
    WiFi.begin(
        currentCredentials["ssid"].toString().c_str(),
        currentCredentials["password"].toString().c_str()
    );
    clearTimeout(connectionTracker);
    connectionTracker = setTimeout([this]() {
        this->status = AsyncWifiStatus::AW_READY_FOR_NEXT;
        this->call("connection-timeout");
    }, SECONDS(20), &connectionTracker);
    this->status = AsyncWifiStatus::AW_CONNECTING;
}


void AsyncWifi::prepareNextCredential() {
    if (!this->foundNetworks.size()) {
        this->status = AsyncWifiStatus::AW_IDLE;
        return;
    } else {
        this->currentCredentials = this->foundNetworks[0];
        this->foundNetworks.remove([](JSON& wifi) {
            return true; // since in have to remove the very first element no need to check further
        });
        this->connect(this->currentCredentials);
    }
}

void AsyncWifi::updateCredential(JSON& old, JSON& newValue) {
    this->credentials.remove([&old](JSON& wifi) {
        return old["apName"].toString() == wifi["apName"].toString();
    });
    this->credentials.push_back(newValue);
    this->save();
}

void AsyncWifi::startProvisioning(String ssid, String password, String domain) {
    clearTimeout(this->connectionTracker);
    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP(ssid.c_str(), password.c_str());
    Serial.println(WiFi.softAPIP());
    this->status = AsyncWifiStatus::AW_PROVISION;
    delete coreWebServer;
    coreWebServer = new CoreWebServer(80);
    this->call("configure-routes");
    coreWebServer->begin(domain);
}

std::pair<int, String> AsyncWifi::addNewCredential(JSON newCredential) {
    JSON response;
    JSON query = newCredential;
    String apName = query["apName"].toString();
    String apPass = query["apPass"].toString();
    if (!apName.length() || apPass.length() && apPass.length() < 8) {
        response["type"] = "error";
        response["message"] = "invalid credential";
        return std::make_pair(400, response.toString());            
    }
    newCredential["apName"] = apName;
    newCredential["apPass"] = apPass;
    this->credentials.remove([apName](JSON& cred) {
        return cred["apName"].toString() == apName;
    });
    this->credentials.push_back(newCredential);
    response["type"] = "success";
    response["data"] = this->credentials;
    this->save();
    this->foundNetworks.push_back(newCredential);
    return std::make_pair(200, response.toString());
}

void AsyncWifi::configureRoutes() {
    coreWebServer->get("/api/wifi/config", [this](Request* request) {
        return std::make_pair(200, this->credentials.toString());
    });
    coreWebServer->get("/api/wifi/stop-config", [this](Request* request) {
        this->status = AsyncWifiStatus::AW_READY_FOR_NEXT;
        JSON response;
        response["status"] = "okay";
        return std::make_pair(200, response.toString());
    });
    coreWebServer->get("/api/wifi/id", [this](Request* request) {
        JSON query = coreWebServer->query();
        int index = query["id"].toInt();
        if (index < this->credentials.size()) {
            this->credentials.remove(index);
            this->save();
        }
        return std::make_pair(200, this->credentials.toString());
    });
    coreWebServer->get("/api/wifi/add", [this](Request* request) {
        return this->addNewCredential(coreWebServer->query());
    });
}

void AsyncWifi::save() {
    if (WiFi.status() == WL_CONNECTED && this->currentCredentials) {
        for (int i=0; i<this->credentials.size(); i++) {
            if (this->credentials[i]["apName"].toString() == this->currentCredentials["apName"].toString()) {
                this->credentials[i]["last"] = 1;
            } else {
                this->credentials[i]["last"] = 0;
            }
        }
    }
    database.writeFile(WIFI_CREDENTIAL_FILE, this->credentials.toString());
}

void AsyncWifi::listen() {
    switch (this->status) {
        case AsyncWifiStatus::AW_IDLE: {
            this->startScan();
        } break;
        case AsyncWifiStatus::AW_SCANNING: {
            this->handleScaning();
        } break;
        case AsyncWifiStatus::AW_PARSE_NETWORKS: {
            this->parseNetworks();
        } break;
        case AsyncWifiStatus::AW_CONNECTING: {
            this->handleConnecting();
        } break;
        case AsyncWifiStatus::AW_READY_FOR_NEXT: {
            this->prepareNextCredential();
        } break;
        case AsyncWifiStatus::AW_PROVISION: {
            // need to do nothing
        } break;
        case AsyncWifiStatus::AW_CONNECTED: {
            if (WiFi.status() != WL_CONNECTED) {
                this->status = AsyncWifiStatus::AW_IDLE;
                this->call("disconnected");
            }
        } break;
    }
}

// namespace WiFiLoop {
//     Interval* loopTracker = nullptr;
// };

// void WiFiLoop::begin() {
//     clearInterval(loopTracker);
//     asyncWifi.begin();
//     WiFiLoop::loopTracker = setInterval([]() {
//         asyncWifi.listen();
//     }, 200);
// }