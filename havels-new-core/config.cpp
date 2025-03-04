#include "config.h"
#include <mac.h>
#include <Arduino.h>
#include <JSON.h>
#include <vector>



namespace Configuration {
    namespace PulseCounters {
      std::vector<PulseCounter_T> list = {
#ifdef ST1_ST2_ST3_ST4
            { "station-1", 100, 1, 14},
            { "station-2", 100, 1, 15},
            { "station-3", 100, 1, 16},
            { "station-4", 100, 1, 18}
#elif defined(ST5_ST6_ST7_ST8)
            { "station-5", 800, 1, 14},
            { "station-6", 800, 1, 15},
            { "station-7", 800, 1, 17},
            { "station-8", 800, 1, 19}
#elif defined(ST9)
            { "station-9", 800, 25, 19},
            { "station-9", 800, 25, 21},
            { "station-9", 800, 25, 22},
            { "station-9", 800, 25, 23},
            { "station-9", 800, 25, 25}
#elif defined(ST10_ST11)
            { "station-10", 500, 1, 19},
            { "station-11", 500, 1, 21}
#endif
        };

        
    };

    String getConfiguration() {
      JSON config;
      config["mac"] = mac();
      config["stations"] = "[]";
      for (auto station: PulseCounters::list) {
        config["stations"].push_back(station.name);
      }
      return config.toString();
    }

};
