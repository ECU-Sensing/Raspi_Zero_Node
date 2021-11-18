# Author: Colby Sawyer
# Based on the Adafruit documentation for creating a LoRA node (https://learn.adafruit.com/lora-and-lorawan-radio-for-raspberry-pi/usage)

import time
from datetime import datetime
import busio
import random
from digitalio import DigitalInOut
import board
import digitalio
import adafruit_ssd1306
from LoRaPy.lorapy import LoRaPy

import keys
from data import get_data

FEATHER_ID = 1

i2c = busio.I2C(board.SCL, board.SDA)

# 128x32 OLED Display
reset_pin = DigitalInOut(board.D4)
display = adafruit_ssd1306.SSD1306_I2C(128, 32, i2c, reset=reset_pin)
# Clear the display.
display.fill(0)
display.show()
width = display.width
height = display.height

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
cs = DigitalInOut(board.CE1)
irq = DigitalInOut(board.D22)
rst = DigitalInOut(board.D25)

# LoraWAN
last_send = 0

def receive_callback(payload):
    global last_send
    print(payload)
    # reset time 
    last_send = time.time()

    
def try_to_send(message):
    # wait at least 900s before sending next message.
    if last_send + 900 > time.time():
        return
    
    # more than 900s since the last sending.
    lora.send(message, 7)


lora = LoRaPy(keys.devaddr, keys.nwskey, keys.appskey, True, receive_callback)

while True:
    # draw a box to clear the image
    display.fill(0)
    display.text('RasPi LoRaWAN', 35, 0, 1)

    sensor_data = get_data()
    print('Sending packet .....')
    try_to_send(sensor_data)
    print('Sent: \t' + datetime.now().strftime("%H:%M:%S.%f"))
    print("Packet Sent!\n\n")
    #lora.frame_counter += 1
    display.text('Sent Data to TTN!' , 15, 15, 1)
    print('Data sent!')
    display.show()
    time.sleep(30)
