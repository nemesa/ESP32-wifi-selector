#include <Arduino.h>
#include <WiFi.h>
#include "SPIFFS.h"
#include "wifiConnectionManager.h"
#include "wifiScanToJson.h"
#include "serverSetup.h"

#include "sampleDataRequest.h"

void setup()
{
  Serial.begin(115200);
  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  wifiManagerInit();
  Serial.println("Setting up Access Point: ");
  wifiManagerCreateAP();

  Serial.println("Connectiong Wifi if configured: ");
  wifiManagerConnectWifiBasedOnConfig();

  Serial.println("Setting up Async WebServer");
  setupServer();
  server.begin();
  Serial.println("All Done!");
  if (WIFI_CONNECTION_HAS_INTERNET_ACCESS)
  {

    Serial.println("Configure time server");
    configTimeHandler();

    Serial.println("ISO time:");
    Serial.println(getTimeServerISOTimeString(10000));
    getSampleData();
  }
  else
  {
    Serial.println("No internet access...");
  }
}

void loop()
{
  wifiScanLoop();
  wifiManagerLoop();
  // put your main code here, to run repeatedly:
}
