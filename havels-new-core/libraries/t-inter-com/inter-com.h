#ifndef SERIAL_INTREPRETTER_H__
#define SERIAL_INTREPRETTER_H__
#include <functional>
#include <event-handler.h>
#include <definitions.h>
#include <async-core.h>

#define BRIDGE_LOG_ENABLED            true
#define BRIDGE_LOG_DISABLED           false

class InterCom: public EventHandler {
    String data;
    bool log;
    bool listening;
    public:
    HardwareSerial* serial;
    InterCom(HardwareSerial* serial = &Serial1);
    void begin(bool logStatus = BRIDGE_LOG_ENABLED);
    void setBaudRate(uint32_t baud);
    void flush();
    void emit(const String& event, const  String& message="");
    void emit(const String& event, const uint32_t& message);
    void loop();
    void enableLog();
    void disableLog();
    uint32_t dataLength();
};

namespace InterComBridges {
    void loop();
};
extern InterCom interCom;
extern InterCom mainSerial;
#endif