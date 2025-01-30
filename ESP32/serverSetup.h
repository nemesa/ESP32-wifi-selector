
#include "wifiScanToJson.h"
#include "pageHtml.h"
#include "kojs.h"
#include "SPIFFS.h"

#include "ESPAsyncWebServer.h"
//https://github.com/ESP32Async/ESPAsyncWebServer#send-large-webpage-from-progmem
AsyncWebServer server(80);

void setupServer() {

  //server.serveStatic("/ko.3.5.1.min.js", SPIFFS, "/ko.js");

  server.on("/ko.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /ko.js");    
    //request->send_P(200, "text/javascript; charset=UTF-8", ko_js);

    request->send(SPIFFS, "/ko.3.5.1.min.js", "text/javascript");
  });


  server.on("/test", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /test");    
    //request->send_P(200, "text/javascript; charset=UTF-8", ko_js);

    request->send(SPIFFS, "/test.txt", "text/html");
  });

  // server.on("/ko.js", HTTP_GET, [](AsyncWebServerRequest *request) {
  //   Serial.println("HTTP_GET /ko.js");    
  //   request->send_P(200, "text/html; charset=UTF-8", ko_js);
  // });

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /test");
    request->send_P(200, "text/html", app_html);
  });

  server.on("/scan-wifi", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("HTTP_GET /scan-wifi");    
      request->send(200, "application/json", scanWiFiNetworks());               
  });
}