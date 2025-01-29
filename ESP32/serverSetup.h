
#include "wifiScanToJson.h"
#include "pageHtml.h"

#include "ESPAsyncWebServer.h"

AsyncWebServer server(80);

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html><head>
  <title>Setup Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head><body>
  <h3>Setup Page!</h3>
  <br><br>
  
</body></html>)rawliteral";

void setupServer() {
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /");
    request->send_P(200, "text/html", index_html);
  });

  server.on("/test", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /test");
    request->send_P(200, "text/html", app_html);
  });

  server.on("/scan-wifi", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /scan-wifi");    
      request->send_P(200, "application/json", scanWiFiNetworks());               
  });
}