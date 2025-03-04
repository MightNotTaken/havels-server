#include "pulse-counter.h"
#include <clock.h>
#include <database.h>
#include <mac.h>
#include <web_socket.h>
PulseCounter::PulseCounter(PulseCounter_T input) {
    dumpTracker = nullptr;
    synced     = false;
    this->gpio = InputGPIOs::registerNew(input.gpio, INPUT_PULLUP);
    this->name = input.name;
    this->dumpTime = input.dumpTime;
    this->incrementFactor = input.incrementFactor;
    this->flush();
    this->load();
    this->gpio->on("low", [this]() {
        clearTimeout(dumpTracker);
        dumpTracker = setTimeout([this]() {
            int count;
            if (!synced) {
                this->tempCount[hour()] += incrementFactor;
                count = this->tempCount[hour()];
            } else {
                this->referenceCount[hour()] += incrementFactor;
                count = this->referenceCount[hour()];
            }
            console.log(name, count);
        }, this->dumpTime);      
    });
}

void PulseCounter::flush() {
    for (int i=0; i<24; i++) {
        referenceCount[i] = 0;
        tempCount[i] = 0;
        lastPublished[i] = 0;
    }
}

void PulseCounter::load() {
    JSON list;
    if (!database.hasFile(getDBRef())) {
        this->save();
    }
    database.readFile(getDBRef());
    list.load(database.payload());
    for (int i=0; i<24; i++) {
        referenceCount[i] = list[i].toInt();
    }
    database.readFile(getDBRef("publish"));
    list.load(database.payload());
    for (int i=0; i<24; i++) {
        lastPublished[i] = list[i].toInt();
    }
}

String PulseCounter::getDBRef(String ref) {
    return String("/station-" + ref + "/" + name + ".txt");
}

void PulseCounter::synchronize(uint8_t hourDifference) {
    for (int i=0; i<24; i++) {
        referenceCount[i] += tempCount[(i + hourDifference) % 24];
    }
}

void PulseCounter::save() {
    JSON data("[]");
    for (int i=0; i<24; i++) {
        data.push_back(referenceCount[i]);
    }
    database.writeFile(getDBRef(), data.toString());
    for (int i=0; i<24; i++) {
        data.push_back(lastPublished[i]);
    }
    database.writeFile(getDBRef("publish"), data.toString());
}

bool PulseCounter::isSynced() {
    return synced;
}

void PulseCounter::publish() {
    JSON list("[]");
    JSON data;
    data["mac"] = mac();
    data["station"] = name;
    for (int i=0; i<24; i++) {
        if (lastPublished[i] != referenceCount[i]) {
            list.push_back(String(i) + ":" + referenceCount[i]);
            lastPublished[i] = referenceCount[i];
        }
    }
    data["data"] = list.toString();
    JSON ed;
    ed["event"] = "data",
    ed["data"] = data;
    console.log("publishing", ed);
    wsCtrl.write("ps", ed);    
}

namespace PulseCounterCtrl {
    std::vector<PulseCounter*> list;
    void registerCounter(PulseCounter_T input)  {
        list.push_back(new PulseCounter(input));
    }
    void synchronize(uint8_t hourDifference) {
        for (auto pc: list) {
            pc->synchronize(hourDifference);
        }
    }
    void beginDataLoop() {
        setInterval([]() {
            for (auto pc: list) {
                if (pc->isSynced()) {
                    pc->save();
                    pc->publish();
                }
            }
        }, SECONDS(10));
    }
};