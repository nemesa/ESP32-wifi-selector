#include <Arduino.h>
#include <WiFi.h>
#include "SPIFFS.h"
#include "settingsHandler.h"
#include "wifiScanToJson.h"
#include "serverSetup.h"
// char *ap_ssid = "ESP32-Access-Point";
//  IP Configurations
IPAddress local_ip(192, 168, 4, 1);
IPAddress gateway(192, 168, 4, 1);
IPAddress subnet(255, 255, 255, 0);


void setup()
{
  Serial.begin(115200);
  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }
  //Settings settings = readSettings();
  settingsJson = readSettingsJson();

  //char *ap_ssid = settings.ap_ssid;
  const char *ap_ssid = settingsJson["ap_ssid"];
  Serial.println(F("settings:"));
  Serial.print("ap_ssid: ");
  Serial.println(ap_ssid);
  // Connect to WiFi network
  WiFi.mode(WIFI_AP_STA);

   if (settingsJson["ap_password"])
   {
     const char *ap_password = settingsJson["ap_password"];
     WiFi.softAP(ap_ssid, ap_password);
   }
   else
   {
    WiFi.softAP(ap_ssid);
  }

  WiFi.softAPConfig(local_ip, gateway, subnet);

  Serial.println("Setting up Access Point: ");
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  Serial.println("Setting up Async WebServer");
  setupServer();
  server.begin();
  Serial.println("All Done!");
}

void loop()
{
  wifiScanLoop();
  // put your main code here, to run repeatedly:
}
