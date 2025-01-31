#include "SPIFFS.h"
#include <ArduinoJson.h>

JsonDocument settingsJson; 

JsonDocument readSettingsJson()
{
    JsonDocument doc;    
    Serial.println(F("open settings file"));
    
    File file = SPIFFS.open("/settings.json");
    DeserializationError error = deserializeJson(doc, file);
    if (error)
    {
        Serial.println(F("Failed to read settings.json"));
    }    
    file.close();

    return doc;
}
