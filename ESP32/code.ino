#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <BH1750.h>
#define uS_TO_S_FACTOR 1000000ULL  
#define TIME_TO_SLEEP 30 * 60        
#define DHTPIN 13 
#define DS18B20_PIN 14  
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define TDS_PIN 35
const int SOIL_AIR_ADC = 0;      
const int SOIL_WATER_ADC = 4095; 
const char* ssid = "your ssid";
const char* password = "your password";
String supabase_url = "your url";
String anon_key = "your key";
DHT dht(DHTPIN, DHTTYPE);
OneWire oneWire(DS18B20_PIN);
DallasTemperature ds18b20(&oneWire);
BH1750 lightMeter;
WiFiClientSecure client;
HTTPClient http;
void setup() {
  Serial.begin(115200);
  delay(500);  
  Serial.println("\n--- ESP32 WOKE UP ---");
  WiFi.begin(ssid, password);
  int wifiRetry = 0;
  while (WiFi.status() != WL_CONNECTED && wifiRetry < 20) {
    delay(500);
    Serial.print(".");
    wifiRetry++;
  }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nWiFi Failed! Going back to sleep to save power.");
    goToSleep();
  }
  Serial.println("\nWiFi Connected");
  Wire.begin(21, 22);
  dht.begin();
  ds18b20.begin();
  lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  pinMode(SOIL_PIN, INPUT);
  pinMode(TDS_PIN, INPUT);
  delay(3000);
  float dht_humidity = dht.readHumidity();
  float dht_temp = dht.readTemperature();
  ds18b20.requestTemperatures();
  delay(1000);
  float water_temp = ds18b20.getTempCByIndex(0);
  float lux = lightMeter.readLightLevel();
  int soil_raw = 0;
  for (int i = 0; i < 5; i++) {
    soil_raw = analogRead(SOIL_PIN);
    delay(50); 
  }
  float soil_moisture_percent = (float)(soil_raw - SOIL_AIR_ADC) / (SOIL_WATER_ADC - SOIL_AIR_ADC) * 100.0;
  soil_moisture_percent = constrain(soil_moisture_percent, 0.0, 100.0);
  int tds_raw = analogRead(TDS_PIN);
  float voltage = tds_raw * (3.3 / 4095.0);
  float current_temp = (water_temp == DEVICE_DISCONNECTED_C || isnan(water_temp)) ? 25.0 : water_temp;
  float compensation_coeff = 1.0 + 0.02 * (current_temp - 25.0);
  float compensation_voltage = voltage / compensation_coeff;
  float tds_value = (133.42 * compensation_voltage * compensation_voltage * compensation_voltage 
                   - 255.86 * compensation_voltage * compensation_voltage 
                   + 857.39 * compensation_voltage) * 0.5;
  if (tds_value < 0) tds_value = 0;
  JsonDocument doc;
  doc["humidity"] = isnan(dht_humidity) ? 0.0 : dht_humidity;
  doc["light_intensity"] = isnan(lux) ? 0.0 : lux;
  doc["soil_temperature"] = (water_temp == DEVICE_DISCONNECTED_C || isnan(water_temp)) ? 0.0 : water_temp;
  doc["soil_moisture"] = soil_moisture_percent;
  doc["temperature"] = isnan(dht_temp) ? 0.0 : dht_temp;
  doc["tds"] = tds_value;
  String jsonpayload;
  serializeJson(doc, jsonpayload);
  Serial.print("Payload: ");
  Serial.println(jsonpayload);
  Serial.print("Pushing data to Supabase... ");
  client.setInsecure();
  http.begin(client, supabase_url);
  http.addHeader("apikey", anon_key);
  http.addHeader("Authorization", "Bearer " + anon_key);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");
  http.addHeader("Connection", "close");
  int code = http.POST(jsonpayload);
  Serial.printf("HTTP Code: %d\n", code);
  http.end();
  goToSleep();
}
void loop() {}
void goToSleep() {
  Serial.println("Entering Deep Sleep...");
  Serial.flush();
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}