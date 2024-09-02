#ifndef CLOCK_H__
#define CLOCK_H__

#include <TimeLib.h> // Include the Time library
struct Time {
    int hour;
    int min;
    int sec;
    int day;
    int month;
    int year;

    Time() {}

    Time(uint32_t epochSec) {
        tmElements_t tm;
        breakTime(epochSec, tm);
        hour = tm.Hour;
        min = tm.Minute;
        sec = tm.Second;
        day = tm.Day;
        month = tm.Month;
        year = tm.Year + 1970;
    }

    Time(const String& timestamp) {
      sscanf(timestamp.c_str(), "%d/%d/%d %d:%d:%d", &year, &month, &day, &hour, &min, &sec);
    }

    Time(int year, uint8_t month, uint8_t day, uint8_t hour, uint8_t min, uint8_t sec):
    year(year),
    month(month),
    day(day),
    hour(hour),
    min(min),
    sec(sec) {}

    String toString() {
        char stamp[20];
        sprintf(stamp, "%04d/%02d/%02d %02d:%02d:%02d", year, month, day, hour, min, sec);
        return stamp;
    }

    uint32_t epoch() {
        tmElements_t tm;        
        tm.Hour = hour;
        tm.Minute = min;
        tm.Second = sec;
        tm.Day = day;
        tm.Month = month;
        tm.Year = year - 1970;
        return (uint32_t)makeTime(tm);
    }

    int32_t operator-(Time other) {
        return this->epoch() - other.epoch();
    }
};

class Clock {
    bool _synced;
public:
    Clock() {
        this->_synced = false;
    }
    void setCurrentTime(Time);
    Time getCurrentTime();
    bool isSynced() {
        return _synced;
    }
    void sync() {
        this->_synced = true;
    }
} systemClock;

void Clock::setCurrentTime(Time tm) {
    this->_synced = true;
    setTime(tm.hour, tm.min, tm.sec, tm.day, tm.month, tm.year);
}

Time Clock::getCurrentTime() {
    return Time(year(), month(), day(), hour(), minute(), second());
}

#endif
