#ifndef VCNL_H__
#define VCNL_H__
#include <Wire.h>
#include <SparkFun_VCNL4040_Arduino_Library.h>


#define INVALID_PROXIMITY_VALUE    (0xFFFF)

class VCNL {
  VCNL4040* sensor;
  int sda;
  int scl;
  int value;
  bool initialized;
  int calibration;
public:
  VCNL(int sda, int scl);
  ~VCNL();
  bool turnOn();
  void turnOff();
  int read();
  void end();
  void calibrate(int calib);
};
#endif