#ifndef DEFINITION_H__
#define DEFINITION_H__
#include <memory>
#define NULL_REFERENCE   0

#define SEPERATOR      ''
#define invoke(func, ...)  do {\
  if (func) {\
    func(__VA_ARGS__);\
  }\
} while (0)
#if __cplusplus < 201402L
namespace std {
  template<typename T, typename... Args>
  std::unique_ptr<T> make_unique(Args&& ... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
  }
}
#endif
extern int _;

#define SECONDS(x)     ((uint64_t)(x * 1000U))
#define MINUTES(x)     (x * SECONDS(60l))
#define HOURS(x)       (x * MINUTES(60l))
#define DAYS(x)        (x * HOURS(24l))
#define WEEKS(x)       (x * DAYS(7l))

#define _SECONDS_(x)   (x)
#define _MINUTES_(x)   (x * _SECONDS_(60l))
#define _HOURS_(x)     (x * _MINUTES_(60l))
#define _DAYS_(x)      (x * _HOURS_(24l))
#define _WEEKS_(x)     (x * _DAYS_(7l))

#endif