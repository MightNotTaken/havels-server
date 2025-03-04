#ifndef DATABASE_H__
#define DATABASE_H__
#include <Arduino.h>
#define FORMAT_SPIFFS_IF_FAILED    true
class Database {
    String _payload;
public:
    void begin();
    void listDir(const char* dirname = "/", uint8_t levels = 0);
    bool format();
    bool createFile(String name);
    bool writeFile(String name, String data);
    bool readFile(String name);
    bool hasFile(String name);
    bool renameFile(String original, String newer);
    bool removeFile(String filename);
    String& payload();
};

extern Database database;
#endif