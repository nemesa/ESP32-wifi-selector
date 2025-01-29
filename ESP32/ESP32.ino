#include <DNSServer.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ArduinoJson.h>

#include "serverSetup.h"


const char *ap_ssid = "ESP32 192.168.4.1";
//const char* ap_password = "12345678";

// IP Configurations
IPAddress local_ip(192, 168, 4, 1);
IPAddress gateway(192, 168, 4, 1);
IPAddress subnet(255, 255, 255, 0);


void setup() {
  Serial.begin(19200);
  // Connect to WiFi network
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(ap_ssid);
  WiFi.softAPConfig(local_ip, gateway, subnet);

  Serial.println("Setting up Access Point: ");
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  Serial.println("Setting up Async WebServer");
  setupServer();
  server.begin();
  Serial.println("All Done!");
}

void loop() {
  //scanWiFiNetworks();
  delay(5000);
  
}
