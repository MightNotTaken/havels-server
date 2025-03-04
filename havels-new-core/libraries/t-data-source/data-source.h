#ifndef DATA_SOURCE_H__
#define DATA_SOURCE_H__
#include <event-handler.h>
#include <JSON.h>
#include <functional>

class DataSource: public EventHandler {
    String modem;
    bool activated;
public:
    DataSource();
    bool isActive();
    void activate();
    void deactivate();
    void publish(const String& data);
    void listen(String event, std::function<void(String)> callback);
    void begin();
    void configure(
        String server,
        int port,
        String username,
        String password,
        String clientID,
        String willTopic,
        String willMessage
    );
    void emit(String event, String data);
    void emit(String event, JSON data);
};

extern DataSource dataSource;
#endif
