#ifndef MQTT_H__
#define MQTT_H__
#include <Arduino.h>
#include <event-handler.h>
#include <functional>

enum MQTTConnectionResult {
    MQTT_FAILED_TO_OPEN = -1,
    MQTT_NETWORK_OPENED_SUCCESS = 0,
    MQTT_WRONG_PARAMETERS = 1,
    MQTT_ID_OCCUPIED = 2,
    MQTT_FAILED_TO_ACTIVATED_PDP = 3,
    MQTT_DOMAIN_ERROR = 4,
    MQTT_DISCONNECTION_ERROR = 5,
    MQTT_ERROR_IN_CONFIG = 6,
    MQTT_NETWORK_CONNECT_SUCCESS,
    MQTT_NETWORK_CONNECT_ERROR,
};

enum MQTTRegisterResponse {
    MQTT_REGISTERED_SUCCESS = 0,
    MQTT_REGISTERED_ERROR   = 1
};

struct Goodbye_T {
    String topic;
    String message;
};

enum MQTTConnectionStatus {
    MQTT_DISCONNECTED = 0,
    MQTT_CONNECTED = 1
};

class MQTT: public EventHandler {
protected:
    String server;
    int port;
    String username;
    String password;
    String id;
    Goodbye_T goodbye;
    MQTTConnectionStatus status;
public:
    MQTT();
    virtual ~MQTT();
    void setParameters(
        String server,
        int port,
        String username,
        String password,
        String id
    );
    virtual void begin() = 0;
    virtual void registerDevice(std::function<void(MQTTRegisterResponse)> callback) = 0;
    virtual void connect(std::function<void(MQTTConnectionResult)> callback) = 0;
    virtual void disconnect();
    virtual void emit(
        String event,
        String data,
        int mid,
        std::function<void()> success,
        std::function<void()> error
    ) = 0;
    MQTTConnectionStatus connected();
    void listen(
        String event,
        std::function<void(String)> callback
    );
    void setGoodByeParam(
        String topic,
        String message
    );
    void unsubscribe(String event);
};
#endif
