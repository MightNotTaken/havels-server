#ifndef AUDIO_PLAYER_H__
#define AUDIO_PLAYER_H__
#include "Audio.h"
#include <SPIFFS.h>
#include <FS.h>
#include <vector>

#define I2S_DOUT      12
#define I2S_BCLK       5
#define I2S_LRC       18

enum AudioPlayMode {
    PLAY_MODE_IMMEDIATE,
    PUT_IN_QUEUE
};

class AudioPlayer {
    std::vector<String> queue;
public:
    void begin();
    uint32_t play(String filename, AudioPlayMode mode = AudioPlayMode::PUT_IN_QUEUE);
    bool loop();
    void logCurrentAudioDetails();
    void flush();
    void unqueue(String filename);
};
extern AudioPlayer audioPlayer;
extern Audio audio;
#endif
