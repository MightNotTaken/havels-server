#ifndef EVENT_HANDLER_H__
#define EVENT_HANDLER_H__

#include <functional>
#include <map>
#include <iostream>
#include "console.h"

template<typename T>
class EventHandler;

template<typename... Args>
class EventHandler<std::function<void(Args...)>> {
    using FunctionType = std::function<void(Args...)>;
    std::map<String, FunctionType> eventMap;

public:
    void on(String event, FunctionType callback) {
        eventMap[event] = callback;
    }

    void unsubscribe(String event) {
        auto it = eventMap.find(event);
        if (it != eventMap.end()) {
            eventMap.erase(it);
        } else {
            console.log("Event not found for unsubscribe");
        }
    }

    void call(String event, Args... args) {
        auto it = eventMap.find(event);
        if (it != eventMap.end()) {
            auto& function = it->second;
            function(args...);
        } else {
            console.log(event, "not registered");
        }
    }
};

#endif
