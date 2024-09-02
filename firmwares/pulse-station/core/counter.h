#ifndef COUNTER_H__
#define COUNTER_H__
#include "database.h"
class Counter {
    int count;
    String name;
    int hour;
public:
    Counter() {
        this->count = 0;
    }
    void setHour(int hour) {
        this->hour = hour;
    }
    void setName(String name) {
        this->name = name;
    }

    String getFileName() {
        return String("/") + name + "/" + hour + ".txt";
    }

    void reset() {
        this->count = 0;
        Database::writeFile(this->getFileName(), 0);
    }

    int getCount() {
        if (!Database::hasFile(this->getFileName())) {
            this->reset();
        }
        Database::readFile(this->getFileName());
        return Database::payload().toInt();
    }

    int increase() {
        this->count = this->getCount() + 1;
        Database::writeFile(this->getFileName(), this->count);
        return this->count;
    }

    void overrideCount(int count) {
        this->count = count;
        Database::writeFile(this->getFileName(), this->count);
    }
}  tempCount[24], actualCount[24];

namespace Counters {

    void initialize() {
        for (int i=0; i<24; i++) {
            actualCount[i].setHour(i);
            actualCount[i].overrideCount(actualCount[i].getCount());
            actualCount[i].setName("actual");
            tempCount[i].setHour(i);
            tempCount[i].overrideCount(0);
            tempCount[i].setName("temp");
        }
    }

    void flushTemps() {
        for (int i=0; i<24; i++) {
            tempCount[i].reset();
        }
    }

    void merge(int offset) {
        for (int i=0; i<24; i++) {
            actualCount[i].overrideCount(actualCount[i].getCount() + tempCount[(i + offset) % 24].getCount());
        }
    }

    void resetAll() {
        for (int i=0; i<24; i++) {
            actualCount[i].reset();
            tempCount[i].reset();
        }
    }
};
#endif