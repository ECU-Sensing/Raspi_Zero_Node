#!/usr/bin/env python3

# not tested yet.

import sys
from time import sleep
from SX127x.LoRa import *
from SX127x.LoRaArgumentParser import LoRaArgumentParser
from SX127x.board_config import BOARD
from SX127x.constants import MODE
import LoRaWAN
import keys
from LoRaWAN.MHDR import MHDR
from random import randrange
from data import get_data
import counter
import busio
from digitalio import DigitalInOut, Direction, Pull
import board
# Import the SSD1306 module.
#import adafruit_ssd1306

BOARD.setup()
parser = LoRaArgumentParser("LoRaWAN sender")

class LoRaWANotaa(LoRa):
    def __init__(self, verbose = False):
        super(LoRaWANotaa, self).__init__(verbose)

    def on_rx_done(self):
        print("RxDone")

        self.clear_irq_flags(RxDone=1)
        payload = self.read_payload(nocheck=True)

        lorawan = LoRaWAN.new([], keys.appkey)
        lorawan.read(payload)
        print("Payload")
        print(lorawan.get_payload())
        print("Version:")
        print(lorawan.get_mhdr().get_mversion())
        print("Type:")
        print(lorawan.get_mhdr().get_mtype())

        if lorawan.get_mhdr().get_mtype() == MHDR.JOIN_ACCEPT:
            print("Got LoRaWAN join accept")
            print(lorawan.valid_mic())
            devaddr=lorawan.get_devaddr()
            print(devaddr)
            nwskey=lorawan.derive_nwskey(devnonce)
            print(nwskey)
            appskey=lorawan.derive_appskey(devnonce)
            print(appskey)
            print("\n")
            #self.send_uplink_data(nwskey, appskey, devaddr)
            sys.exit(0)

        print("Got LoRaWAN message continue listen for join accept")

    def on_tx_done(self):
        self.clear_irq_flags(TxDone=1)
        print("TxDone")

        self.set_mode(MODE.STDBY)
        self.set_dio_mapping([0,0,0,0,0,0])
        self.set_invert_iq(1)
        self.reset_ptr_rx()
        self.set_mode(MODE.RXCONT)

    def start(self):
        self.tx_counter = 1

        lorawan = LoRaWAN.new(keys.appkey)
        lorawan.create(MHDR.JOIN_REQUEST, {'deveui': keys.deveui, 'appeui': keys.appeui, 'devnonce': devnonce})

        self.write_payload(lorawan.to_raw())
        self.set_mode(MODE.TX)
        while True:
            sleep(1)
        

# Init
devnonce = [randrange(256), randrange(256)]
lora = LoRaWANotaa(False)

# Setup
lora.set_mode(MODE.SLEEP)
lora.set_dio_mapping([1,0,0,0,0,0])
lora.set_freq(924.5)
lora.set_pa_config(pa_select=1)
lora.set_spreading_factor(7)
lora.set_pa_config(max_power=0x0F, output_power=0x0E)
lora.set_sync_word(0x34)
lora.set_rx_crc(True)

# Create the I2C interface.
#i2c = busio.I2C(board.SCL, board.SDA)
# 128x32 OLED Display
#reset_pin = DigitalInOut(board.D4)
#display = adafruit_ssd1306.SSD1306_I2C(128, 32, i2c, reset=reset_pin)
# Clear the display.
#display.fill(0)
#display.show()
#width = display.width
#height = display.height

print(lora)
assert(lora.get_agc_auto_on() == 1)

#display.fill(0)

# Attempt to set up the RFM9x Module
try:
    print("Sending LoRaWAN join request\n")
    #display.text("LoRaWAN OTAA ESDN", 0,0,1)
    lora.start()
except KeyboardInterrupt:
    sys.stdout.flush()
    print("\nKeyboardInterrupt")
except RuntimeError as error:
    # Thrown on version mismatch
    #display.text('RFM9x: ERROR', -40, 0, 1)
    print('RFM9x Error: ', error)
finally:
    sys.stdout.flush()
    lora.set_mode(MODE.SLEEP)
    BOARD.teardown()