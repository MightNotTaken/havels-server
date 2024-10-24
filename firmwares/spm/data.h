#ifndef DATA_SOURCE_H__
#define DATA_SOURCE_H__

#include "core/core.h"
#include "core/JSON.h"
#include <vector>
#include "core/mac.h"
#include <SoftwareSerial.h>
#include <functional>
#include "core/mac.h"
#include <Arduino.h>
#include "board.h"

class DataSource_T {
    int id;
    String Rating;
    float R_Val;
    bool R_Pass;
    int Hold_Val;
    bool Hold_Pass;
    int Trip_Val;
    bool Trip_Pass;
    bool HV_Pass;
    bool Overall_Pass;
    String qr;
public:
    
    String toString() {
        JSON json("[]");
        json.push_back(id);
        json.push_back(qr);
        json.push_back(Rating);
        json.push_back(R_Val);
        json.push_back(R_Pass ? 1 : 0);
        json.push_back(Hold_Val);
        json.push_back(Hold_Pass ? 1 : 0);
        json.push_back(Trip_Val);
        json.push_back(Trip_Pass ? 1 : 0);
        json.push_back(HV_Pass ? 1 : 0);
        json.push_back(Overall_Pass ? 1 : 0);
        return json.toString();
    }

    void parse(String raw) {
        Rating = raw.substring(3, 6);  
        R_Val = raw.substring(6, 15).substring(4).toFloat();  
        R_Pass = (raw.substring(15, 20) == "RPAS1");  
        Hold_Val = raw.substring(20, 28).substring(5).toInt();  
        Hold_Pass = (raw.substring(28, 34) == "HOLDP1");  
        Trip_Val = raw.substring(34, 42).substring(5).toInt();  
        Trip_Pass = (raw.substring(42, 48) == "TRIPP1");  
        HV_Pass = (raw.substring(48, 52) == "HVP1");  
        Overall_Pass = (raw.substring(52, 57) == "OVER1");  
    }

    void setID(int id) {
        this->id = id;
    }

    void setQR(String qr) {
        this->qr = qr;
    }
    
};


DataSource_T dataSource;

SoftwareSerial serialA(RX_PIN, TX_PIN);
namespace DataSource {
    String data = "";

    std::function<void(String)> dataCallback;

    void onData(std::function<void(String)> callback) {
        dataCallback = callback;
    }

    void begin() {
        pinMode(DIRECTION_PIN, OUTPUT);
        digitalWrite(DIRECTION_PIN, LOW);
        serialA.begin(9600);
        setInterval([]() {
            while (serialA.available()) {
                delay(2);
                char ch = serialA.read();
                data += ch;
            }
            
            if (data.indexOf("RAT") > -1 && !data.startsWith("RAT")) {
                data = data.substring(data.indexOf("RAT"));
            }
            if (data.indexOf("OVER") > -1) {
                data.replace(" ", "");
                dataSource.parse(data);
                data = "";
                dataCallback(dataSource.toString());
            }            
        }, 100);
    }
};
#endif
