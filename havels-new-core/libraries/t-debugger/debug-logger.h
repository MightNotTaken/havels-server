#ifndef DEBUG_LOGGER_H__
#define DEBUG_LOGGER_H__
#include <Arduino.h>
#include <vector>
typedef std::vector<String> dl_table_row_t;
typedef std::vector<dl_table_row_t> dl_table_t;

enum LineType {
    LINE_START,
    LINE_SEPERATOR,
    LINE_END
};
class DebugLogger
{
    int width;
    std::vector<int> cellWidths;

public:
    template <typename T>
    String forS(T input, int width, char fill = ' ') {
        String inp(input);
        if (inp.length() > width) {
            inp = inp.substring(0, width - 2) + "..";
            return inp.c_str();
        }
        if (inp.length() == width) {
            return inp.c_str();
        }
        int margin = (width - inp.length()) / 2;
        for (int i = 0; i < margin; i++) {
            inp += fill;
        }
        while (inp.length() < width) {
            inp = String(fill) + inp;
        }
        return inp;
    }
    void setScreenWidth(int width);
    void line(char fill = '-', int width = -1, LineType type = LINE_START);
    void display(std::vector<String> values);

    template <typename T>
    void display(std::initializer_list<T> values) {
        std::vector<String> stringList;
        for (auto &item : values) {
            stringList.push_back(item);
        }
        display(stringList);
    }
    void resetCellWidths(uint8_t newCells);
    void calculateCellWidths(std::vector<String> list);

    template <typename T>
    void calculateCellWidths(std::initializer_list<T> list) {
        std::vector<String> stringList;
        for (auto &item : list) {
            stringList.push_back(item);
        }
        calculateCellWidths(stringList);
    }

    void display(String singleItem);

    template <typename T>
    void displayTable(
        String heading,
        std::initializer_list<T> columnHeadings,
        dl_table_t table
    ) {
        resetCellWidths(columnHeadings.size());
        calculateCellWidths(columnHeadings);
        for (auto &row : table) {
            calculateCellWidths(row);
        }
        Serial.println();
        display(heading);
        display(columnHeadings);
        line('-', this->width, LineType::LINE_START);
        for (const auto &row : table) {
            display(row);
        }
        line('-', this->width, LineType::LINE_END);
        Serial.println();
    }
};

extern DebugLogger debugLogger;
#endif
