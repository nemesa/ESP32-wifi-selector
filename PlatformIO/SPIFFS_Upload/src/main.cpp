#include <Arduino.h>
#include "SPIFFS.h"

// put function declarations here:
int myFunction(int, int);

void setup() {  	
  Serial.begin(115200);
  if(!SPIFFS.begin(true)){
     Serial.println("An Error has occurred while mounting SPIFFS");
     return;
  }
  else{
    File file2 = SPIFFS.open("/test.txt");
    if(!file2){
      Serial.println("Failed to open file for reading");
      return;
    }
    else{
      while(file2.available()){
        Serial.write(file2.read());
      }      	
      file2.close();
    }
  }
}

void loop() {
  // put your main code here, to run repeatedly:
}

// put function definitions here:
int myFunction(int x, int y) {
  return x + y;
}