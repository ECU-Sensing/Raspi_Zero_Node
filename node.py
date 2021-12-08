# Author: Colby Sawyer
# Based on the Adafruit documentation for creating a LoRA node (https://learn.adafruit.com/lora-and-lorawan-radio-for-raspberry-pi/usage)
from time import sleep
from datetime import datetime
import busio
import random
from digitalio import DigitalInOut
import board
import digitalio
import adafruit_ssd1306
from .txrx_ttn import LoRaWanSystem


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

# First: Send
lora = LoRaWanSystem(False)

# Setup
lora.set_mode(MODE.SLEEP)
lora.set_dio_mapping([1, 0, 0, 0, 0, 0])
lora.set_freq(902.7)
lora.set_pa_config(pa_select=1)
lora.set_spreading_factor(7)
lora.set_pa_config(max_power=0x0F, output_power=0x0E)
lora.set_sync_word(0x34)
lora.set_rx_crc(True)

print(lora)
assert(lora.get_agc_auto_on() == 1)


while True:
    # draw a box to clear the image
    display.fill(0)
    display.text('RasPi LoRaWAN', 35, 0, 1)

    try:
        print("Sending LoRaWAN message\n")
        lora.do_send()
        sleep(0.1)
        lora.set_mode(MODE.SLEEP)

    except KeyboardInterrupt:
        sys.stdout.flush()
        print("\nKeyboardInterrupt")

    finally:
        sys.stdout.flush()
        lora.set_mode(MODE.SLEEP)
        BOARD.teardown()
        
    print('Sending packet .....')
    print('Sent: \t' + datetime.now().strftime("%H:%M:%S.%f"))
    print("Packet Sent!\n\n")
    #lora.frame_counter += 1
    display.text('Sent Data to TTN!' , 15, 15, 1)
    print('Data sent!')
    display.show()
    time.sleep(30)
