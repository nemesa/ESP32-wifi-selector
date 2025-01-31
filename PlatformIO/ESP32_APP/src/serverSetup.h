#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"
// https://github.com/ESP32Async/ESPAsyncWebServer#send-large-webpage-from-progmem
AsyncWebServer server(80);

const char app_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<head>
</head>
<body>    
    <div>
        hello from app
    </div>
</body>
</html>
)rawliteral";

void setupServer()
{

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("HTTP_GET /");        
    request->send(SPIFFS, "/index.html", "text/html"); 
  });

  server.on("/ko.js", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("HTTP_GET /ko.js");
    request->send(SPIFFS, "/ko.3.5.1.min.js", "text/javascript"); 
  });

  server.on("/scan-wifi", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("HTTP_GET /scan-wifi");
    clearWifiScanResultAndDoNewScan();
    request->send(200, "text/plain", "OK"); 
  });

  server.on("/scan-wifi-result", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("HTTP_GET /scan-wifi-result");
    // Create a char array to store the JSON string
    static char jsonOutput[1024];
    serializeJson(wifiScanDoc, jsonOutput);
  
    request->send(200, "application/json", jsonOutput); 
  });

  server.on("/settings", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("HTTP_GET /settings");
    static char jsonOutput[1024];
    serializeJson(settingsJson, jsonOutput);
  
    request->send(200, "application/json", jsonOutput); 
  });
}
