#ifndef DATA_SOURCE_H__
#define DATA_SOURCE_H__
#include <Arduino.h>
#include "core/core.h"
#include "core/JSON.h"
#include <vector>
#include "core/mac.h"
enum MCBResult {
    MCB_PASS              = 1,
    MCB_EARLY_TRIP        = 2,
    MCB_LATE_TRIP         = 3,
    MCB_NO_TRIP           = 4,
    MCB_INVALID_RESPONSE  = 5,
};
enum Mode {
    CALIBRATION = 0,
    VERIFICATION = 1
};

class ProductionParameters {
    Mode mode;
    String rating;
    float current;
    float ambient;
    int t1;
    int t2;
    int t3;
    int t4;
public:
    void update(
        Mode mode,
        String rating,
        float current,
        float ambient,
        int t1,
        int t2,
        int t3,
        int t4
    ) {
        this->mode    = mode;
        this->rating  = rating;
        this->current = current;
        this->ambient = ambient;
        this->t1      = t1;
        this->t2      = t2;
        this->t3      = t3;
        this->t4      = t4;
    }

    bool same(
        Mode mode,
        String rating,
        float current,
        float ambient,
        int t1,
        int t2,
        int t3,
        int t4
    ) {
        return this->mode    == mode &&
        this->rating  == rating &&
        this->current == current &&
        this->ambient == ambient &&
        this->t1      == t1 &&
        this->t2      == t2 &&
        this->t3      == t3 &&
        this->t4      == t4;
    }

    String toString() {
        JSON json("[]");
        json.push_back(MAC::getMac());
        json.push_back(this->mode == Mode::CALIBRATION ? "CAL" : "VER");
        json.push_back(this->rating);
        json.push_back(this->current);
        json.push_back(this->ambient);
        json.push_back(this->t1);
        json.push_back(this->t2);
        json.push_back(this->t3);
        json.push_back(this->t4);
        return json.toString();        
    }
} productionParams;

class DataSource_T {
    int stationID;
    float tripTime;
    MCBResult result;
    static int count;
    int benchID;
public:
    DataSource_T() {
        DataSource_T::count++;
        this->stationID = DataSource_T::count;
        this->flush();
    }

    void setTripTime(float time) {
        this->tripTime = time;
    }

    void setResult(MCBResult result) {
        this->result = result;
    }

    void flush() {
        tripTime = -1;
        result = MCBResult::MCB_INVALID_RESPONSE;
    }

    bool available() {
        return tripTime != -1 && result != MCBResult::MCB_INVALID_RESPONSE;
    }

    String toString() {
        JSON response;
        // response["mac"] = MAC::getMac();
        response["trip"] = tripTime;
        response["station"] = stationID;
        response["result"] = result;
        return response.toString();
    }

};

int DataSource_T::count = 0;

namespace DataSource {
    String data;
    DataSource_T benches[24];
    std::vector<String> segments;
    void split();
    void parse();
    void begin() {
        setInterval([]() {
            while (Serial.available()) {
                delay(1);
                char ch = Serial.read();
                if (ch == '*') {
                    data = "";
                    continue;
                }
                if (ch == '#') {
                    data += ',';
                    DataSource::parse();
                    data = "";
                }
                data += ch;
            }
        }, 100);
    }

    void split() {
        segments.clear();
        segments.shrink_to_fit();
        String segment = "";
        for (auto ch: data) {
            if (ch == ',') {
                segments.push_back(segment);
                segment = "";
                continue;
            }
            segment += ch;
        }
    }


    void parse() {
        split();
        if (segments.size() == 44) {
            Mode mode = (Mode)segments[0].toInt();
            String rating = segments[1];
            float current = segments[2].toFloat();
            float ambient = segments[3].toFloat();
            int t1 = segments[4].toInt();
            int t2 = segments[5].toInt();
            int t3 = segments[6].toInt();
            int t4 = segments[7].toInt();
            if (!productionParams.same(mode, rating, current, ambient, t1, t2, t3, t4)) {
                productionParams.update(mode, rating, current, ambient, t1, t2, t3, t4);
            }
            for (int i=0; i<12; i++) {
                int stationID = segments[8 + i*3 + 0].toInt() - 1;
                float tripTime = segments[8 + i*3 + 1].toFloat();
                MCBResult result = (MCBResult)segments[8 + i*3 + 2].toInt();
                if (stationID <= 24) {
                    DataSource::benches[stationID].setResult(result);
                    DataSource::benches[stationID].setTripTime(tripTime);
                    console.log(DataSource::benches[i]);
                }
            }
        }
    }
};
#endif
