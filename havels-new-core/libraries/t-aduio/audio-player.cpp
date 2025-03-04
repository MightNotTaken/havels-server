#include "audio-player.h"
#include <async-core.h>
#include <async-core-web-server.h>
#include <JSON.h>
#include <database.h>
#include <console.h>
#include <timeout.h>

using namespace Timeouts;

Audio audio;
AudioPlayer audioPlayer;

void AudioPlayer::begin() {
    audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
    audio.setVolume(audio.maxVolume());
    audio.forceMono(true);
    coreWebServer->on("register-call", [this](String) {
        console.log("registering audio routes");
        coreWebServer->get("/audio-play", [this](Request* request, CodeResponsePair callback) {
            JSON response;
            int code = 200;
            JSON query = coreWebServer->query();
            response["message"] = "Success";
            console.log("query", query);
            this->play(query["file"].toString());
            invoke(callback, code, response.toString());
        });
        coreWebServer->getActualServer()->on("/audio-download", HTTP_POST, [](AsyncWebServerRequest *request) {
            JSON json;
            json["status"] = "okay";
            AsyncWebServerResponse *response = request->beginResponse(200, "application/json", json.toString());
            coreWebServer->handleCors(response);
            request->send(response);
        }, [](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final) {
        if (!index) {
            Serial.printf("UploadStart: %s\n", filename.c_str());
            if (!SPIFFS.open("/" + filename, FILE_WRITE)) {
            Serial.println("Failed to open file for writing");
            return request->send(500, "text/plain", "Failed to open file for writing");
            }
        }
        File file = SPIFFS.open("/" + filename, FILE_APPEND);
        if (file) {
            if (file.write(data, len) != len) {
            Serial.println("Failed to write file");
            return request->send(500, "text/plain", "Failed to write file");
            }
            file.close();
        } else {
            Serial.println("Failed to open file for appending");
            return request->send(500, "text/plain", "Failed to open file for appending");
        }
        if (final) {
            Serial.printf("UploadEnd: %s, %u B\n", filename.c_str(), index + len);
            JSON json;
            json["status"] = "okay";
            AsyncWebServerResponse *response = request->beginResponse(200, "application/json", json.toString());
            coreWebServer->handleCors(response);
            request->send(response);
        }
        });
    });
}

void AudioPlayer::logCurrentAudioDetails() {
    console.log("sample rate:", audio.getSampleRate());
    console.log("bits per sample:", audio.getBitsPerSample());
    console.log("chanel:", audio.getChannels());
    console.log("bit rate:", audio.getBitRate());
    console.log("audio duration", audio.getAudioFileDuration());
    console.log("audio current time", audio.getAudioCurrentTime());
}


void AudioPlayer::unqueue(String filename) {
    queue.erase(std::remove(queue.begin(), queue.end(), filename), queue.end());
}

uint32_t AudioPlayer::play(String filename, AudioPlayMode mode) {
    console.log("tx", filename);
    if (mode == AudioPlayMode::PLAY_MODE_IMMEDIATE) {
        audio.stopSong();
        audio.connecttoFS(SPIFFS, filename.c_str());
        // logCurrentAudioDetails();
        return audio.getTotalPlayingTime();
    } else {
        if (database.hasFile(filename)) {
            queue.push_back(filename);
        } else {
            console.log("Audio file does not exist");
        }
    }
    return 0;
}


void AudioPlayer::flush() {
    queue.clear();
    audio.stopSong();
}

bool AudioPlayer::loop() {
    if (audio.isRunning()) {
        audio.loop();  
        return true;
    } else {
        if (!queue.empty()) {
            String nextFile = queue.front();
            queue.erase(queue.begin());
            play(nextFile, AudioPlayMode::PLAY_MODE_IMMEDIATE);
        }
        return false;
    }
}