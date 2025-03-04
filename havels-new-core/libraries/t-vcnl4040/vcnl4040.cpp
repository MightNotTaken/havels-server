#include "vcnl4040.h"

VCNL::VCNL(int sda, int scl):
sda(sda), scl(scl) {
  value = 0;
  calibration = 0;
  sensor = new VCNL4040();
  initialized = false;
  Wire.begin(sda, scl);
  sensor->begin();
}

bool VCNL::turnOn() {
  Wire.begin(sda, scl);
  sensor->powerOnProximity();
  return true;
}

void VCNL::turnOff() {
  Wire.begin(sda, scl);
  sensor->powerOffProximity();
  Wire.end();
}

int VCNL::read() {
  value = INVALID_PROXIMITY_VALUE;
  Wire.begin(sda, scl);
  value = sensor->getProximity();

  Wire.end();
  return value - calibration;
}

void VCNL::calibrate(int calib) {
  calibration = calib;
}

void VCNL::end() {
}

VCNL::~VCNL() {
  delete sensor;
}