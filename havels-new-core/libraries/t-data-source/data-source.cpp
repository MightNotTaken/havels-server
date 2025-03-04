#include "data-source.h"
#include <inter-com.h>
// #include <gsm-mqtt.h>
#include <mac.h>
#include <async-core.h>
#include <timeout.h>
#include <console.h>

using namespace Timeouts;

DataSource dataSource;

DataSource::DataSource() {
    activated = false;
}

void DataSource::activate() {
    this->activated = true;
}

void DataSource::deactivate() {
    this->activated = false;
}

void DataSource::publish(const String& _data) {
    JSON data(_data);
    String event = data["event"].toString();
    event.replace(mac() + "/", "");
    String dataToPublish = data["data"].toString();
    dataToPublish.replace("\\n", "\n");
    call(event, data["data"].toString());
}

bool DataSource::isActive() {
    return this->activated;
}

void DataSource::begin() {
    interCom.on("mqtt:data", [this](String data) {
        console.log("wifi:mqtt:data", data);
        publish(data);
    });
    interCom.on("mqtt:connected", [this](String data) {
        console.log("mqtt:connected", data);
        interCom.emit("mqtt:listen", mac());
        setTimeout([this]() {
            this->modem = "wifi";
            this->activate();
            this->call("listener-active", this->modem);
        }, 1000);
    });
    /*
    gsmMQTT.on("mqtt:data", [this](String data) {
        console.log("gsm:mqtt:data", data);
        publish(data);
    });
    gsmMQTT.on("mqtt:connected", [this](String data) {
        setTimeout([this]() {
            this->modem = "gsm";
            this->activate();
            this->call("listener-active", this->modem);
        }, 1000);
    });

    gsmMQTT.on("release", [this](String) {
        this->activate();
    });
    
    gsmMQTT.on("busy", [this](String) {
        this->deactivate();
    });
    
    gsmMQTT.on("disconnect", [this](String) {
        this->deactivate();
    });
    */
    interCom.on("r:mqtt:emit", [](String data) {
        console.log("r:mqtt:emit", data);
    }, false);
}

void DataSource::emit(String event, String data) {
    if (this->modem == "gsm") {
        // gsmMQTT.emit(
        //     event,
        //     data,
        //     gsmMQTT.getNextMessageID(),
        //     []() {
        //         console.log("[gsm]> message emitted");
        //     },
        //     []() {
        //         console.log("[gsm]> message failed");
        //     }
        // );
    } else if (this->modem == "wifi") {
        interCom.emit("mqtt:emit", event + SEPERATOR + data);
    }
}

void DataSource::emit(String event, JSON data) {
    emit(event, data.toString());
}

void DataSource::configure(
    String server,
    int port,
    String username,
    String password,
    String clientID,
    String willTopic,
    String willMessage
) {
    console.log("mac", clientID);

    // gsmMQTT.setParameters(
    //     server,
    //     port,
    //     username,
    //     password,
    //     clientID
    // );
    // gsmMQTT.setGoodByeParam(willTopic, willMessage);
    
    interCom.emit("mqtt:server",       server);
    interCom.emit("mqtt:port",         port);
    interCom.emit("mqtt:username",     username);
    interCom.emit("mqtt:password",     password);
    interCom.emit("mqtt:clientID",     clientID);
    interCom.emit("mqtt:will-message", willTopic);
    interCom.emit("mqtt:will-topic",   willMessage);
    
    interCom.on("r:mqtt:will-topic", [](String) {
        console.log("MQTT parameters successfully configured");
    }, OVERRIDE_PREVIOUS_LISTENERS);

}