#include "database.h"
#include <Wire.h>
#include <FS.h>

#ifndef ESP32
#define FILE_WRITE "w"
#define FILE_READ "r"
#define FILE_APPEND "a"
#else
#include <SPIFFS.h>
#endif

Database database;

void Database::begin() {
    Wire.begin();
    SPIFFS.begin(
#ifdef ESP32
        FORMAT_SPIFFS_IF_FAILED
#endif
    );
}

void Database::listDir(const char *dirname, uint8_t levels) {
    File root = SPIFFS.open(dirname);
    if (!root) {
        Serial.println("Failed to open directory");
        return;
    }
    if (!root.isDirectory()) {
        Serial.println("Not a directory");
        return;
    }

    File file = root.openNextFile();
    while (file) {
        if (file.isDirectory())
        {
            Serial.print("  DIR : ");
            Serial.println(file.name());
            if (levels)
            {
                listDir(file.name(), levels - 1);
            }
        }
        else
        {
            Serial.print("  FILE: ");
            Serial.print(file.name());
            Serial.print("\tSIZE: ");
            Serial.println(file.size());
        }
        file = root.openNextFile();
    }
}
bool Database::format() {
    return SPIFFS.format();
}

bool Database::createFile(String name) {
    File file = SPIFFS.open(name, FILE_WRITE);
    if (file) {
        file.close();
        return true;
    }
    else {
        return false;
    }
}


bool Database::writeFile(String name, String data) {
    File file = SPIFFS.open(name, FILE_WRITE);
    if (!file) {
        return false;
    }
    if (!file.print(String(data))) {
        file.close();
        return false;
    }
    file.close();
    return true;
}

bool Database::readFile(String name) {
    this->_payload = "";
    File file = SPIFFS.open(name, FILE_READ);
    if (!file) {
        return false;
    }
    int index = 0;
    while (index++ < file.size()) {
        this->_payload += (char)file.read();
    }
    return true;
}

bool Database::hasFile(String name) {
    return SPIFFS.exists(name);
}

bool Database::renameFile(String original, String newer) {
    if (Database::hasFile(original)) {
        SPIFFS.rename(original, newer);
        return true;
    }
    return false;
}

bool Database::removeFile(String filename) {
    if (Database::hasFile(filename)) {
        SPIFFS.remove(filename);
        return true;
    }
    return false;
}

String& Database::payload() {
    return this->_payload;
}