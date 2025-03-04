#include "mqtt.h"
#include <console.h>

MQTT::MQTT() {

}

MQTT::~MQTT() {
    
}

void MQTT::setParameters(
    String server,
    int port,
    String username,
    String password,
    String id
) { 
    this->server = server;
    this->port = port;
    this->username = username;
    this->password = password;
    this->id = id;
}

void MQTT::setGoodByeParam(
    String topic,
    String message
) {
    this->goodbye.topic = topic;
    this->goodbye.message = message;
}

void MQTT::registerDevice(std::function<void(MQTTRegisterResponse)> callback) {
    console.log("registerDevice() not implemented");
}


void MQTT::disconnect() {
    console.log("disconnect() not implemeted");
}

MQTTConnectionStatus MQTT::connected() {
    return this->status;
}

void MQTT::connect(std::function<void(MQTTConnectionResult)> callback) {
    console.log("connect not implemented");
}

void MQTT::listen(
    String event,
    std::function<void(String)> callback
) {
    this->on(String("event:") + event, callback);
}

void MQTT::unsubscribe(String event) {
    EventHandler::unsubscribe(String("event:") + event);
}

void MQTT::emit(
    String event,
    String data,
    int mid,
    std::function<void()> success,
    std::function<void()> error
) {
    console.log("emit function not implemented");
}

void MQTT::begin() {
    console.log("begin not implemented");
}