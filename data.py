from node_extra import FEATHER_ID


# Author: Colby Sawyer
# Dummy implementation of data. This used generate random "Weather" data. 
# It is recommended that you prepackage your data in a bytearray here so that you can have have a sketch for the decoder later

import random

def get_data():
    # Here is where you can add your sensor specific information. The driving code will use whatever data is here
    sensor_data = bytearray(7)
    FEATHER_ID = 1

    temp_val = 75 + random.randint(0,25)
    humid_val = 1000 - random.randint(0,250)

    sensor_data[0] = FEATHER_ID
    # Temperature data
    sensor_data[1] = (temp_val >> 8) & 0xff
    sensor_data[2] = temp_val & 0xff
    # Humidity data
    sensor_data[3] = (humid_val >> 8) & 0xff
    sensor_data[4] = humid_val & 0xff

    return sensor_data
