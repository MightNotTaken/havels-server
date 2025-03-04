#include "debug-logger.h"

DebugLogger debugLogger;

void DebugLogger::setScreenWidth(int width) {
    this->width = width;
}


void DebugLogger::line(char fill, int width, LineType type) {
    if (width < 0) {
        width = this->width;
    }
    switch (type) {
        case LineType::LINE_START: Serial.write('┌');
            break;
        case LineType::LINE_SEPERATOR: Serial.write('├');
            break;
        case LineType::LINE_END: Serial.write('└');
            break;
    }
    Serial.print(forS('-', width - 3, '-'));
    switch (type) {
        case LineType::LINE_START: Serial.write('┐');
            break;
        case LineType::LINE_SEPERATOR: Serial.write('┤');
            break;
        case LineType::LINE_END: Serial.write('┘');
            break;
    }
    Serial.println();
}

  
void DebugLogger::display(std::vector<String> values) {
    uint8_t i = 0;
    Serial.print('|');
    for (const auto & value: values) {
        Serial.print(forS(value, cellWidths[i++]));
        Serial.print('|');
    }
    Serial.println();
}

void DebugLogger::resetCellWidths(uint8_t newCells) {
    cellWidths.clear();
    for (int i=0; i<newCells; i++) {
        cellWidths.push_back(0);
    }
    width = 0;
}
void DebugLogger::calculateCellWidths(std::vector<String> list) {
    uint8_t i = 0;
    uint16_t fullWidth = 1;
    bool changed = false;
    for (auto& item: list) {
        if (cellWidths[i] < String(item).length()) {
        cellWidths[i] = String(item).length() + 4;
        }
        fullWidth += cellWidths[i++] + 1;
    }
    if (fullWidth > width) {
        width = fullWidth;
    }
}


void DebugLogger::display(String singleItem) {
    line('-', this->width, LineType::LINE_START);
    Serial.print('|');
    Serial.print(forS(singleItem, width - 2));
    Serial.println('|');
    line('-', this->width, LineType::LINE_SEPERATOR);
}
