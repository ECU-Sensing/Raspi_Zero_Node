# Author: Colby Sawyer
# GPS Sensor Implementation for Raspberry Pi LoRa Node
# Based on the Adafruit Industries project: https://learn.adafruit.com/adafruit-mini-gps-pa1010d-module/circuitpython-python-i2c-usage 

import time
import board
import busio

import adafruit_gps
import pynmea2
import serial

def get_gps_data(i2c=True, uart=False):
    """Gets GPS data at instance 

    Args:
        i2c (bool, optional): Specifies if I2C interfaces is to be used to communicate with GPS module. Defaults to True.
        uart (bool, optional): Specifies if UART is to be used to communicate with GPS module. Defaults to False.

    Returns:
        float[]: [latitude, longitude]
    """

    if uart:
        # Create a serial connection for the GPS connection using default speed and
        # a slightly higher timeout (GPS modules typically update once a second).
        # These are the defaults you should use for the GPS FeatherWing.
        # For other boards set RX = GPS module TX, and TX = GPS module RX pins.
        uart = busio.UART(board.TX, board.RX, baudrate=9600, timeout=10)

        # for a computer, use the pyserial library for uart access
        # import serial
        uart = serial.Serial("/dev/ttyUSB0", baudrate=9600, timeout=10)

        # Create a GPS module instance.
        gps = adafruit_gps.GPS(uart)  # Use UART/pyserial

    if i2c:
        # If using I2C, we'll create an I2C interface to talk to using default pins
        i2c = board.I2C()

        # Create a GPS module instance.
        gps = adafruit_gps.GPS_GtopI2C(i2c)  # Use I2C interface

    # Initialize the GPS module by changing what data it sends and at what rate.
    # These are NMEA extensions for PMTK_314_SET_NMEA_OUTPUT and
    # PMTK_220_SET_NMEA_UPDATERATE but you can send anything from here to adjust
    # the GPS module behavior:
    #   https://cdn-shop.adafruit.com/datasheets/PMTK_A11.pdf

    # Turn on the basic GGA and RMC info (what you typically want)
    #gps.send_command(b"PMTK314,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0")
    # Turn on just minimum info (RMC only, location):
    gps.send_command(b'PMTK314,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0')
    # Turn off everything:
    # gps.send_command(b'PMTK314,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0')
    # Turn on everything (not all of it is parsed!)
    # gps.send_command(b'PMTK314,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0')

    # Set update rate to once a second (1hz) which is what you typically want.
    #gps.send_command(b"PMTK220,1000")
    # Or decrease to once every two seconds by doubling the millisecond value.
    # Be sure to also increase your UART timeout above!
    gps.send_command(b'PMTK220,2000')
    # You can also speed up the rate, but don't go too fast or else you can lose
    # data during parsing.  This would be twice a second (2hz, 500ms delay):
    # gps.send_command(b'PMTK220,500')

    data = gps.read(32)  # read up to 32 bytes
    # print(data)  # this is a bytearray type
    if data is not None:
        # convert bytearray to string
        data_string = "".join([chr(b) for b in data])
        msg = pynmea2.parse(data_string)
        lon = float(msg.lon)
        lat = float(msg.lat)
        # More Information: https://github.com/Knio/pynmea2

    return [lat,lon]