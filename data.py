# Author: Colby Sawyer
# Dummy implementation of data. This used generate random "Weather" data. 
# It is recommended that you prepackage your data in a bytearray here so that you can have have a sketch for the decoder later
import psutil
import random
from func_timeout import func_timeout, FunctionTimedOut
#from devices.hydros import Hydros

#def use_encoder():
    #return Hydros().get_data()

def get_data():
    # Here is where you can add your sensor specific information. The driving code will use whatever data is here

    # The Code section below uses default encoding convention with random values for Temperature, Humidity and Pressure
    sensor_data = bytearray(7)
    FEATHER_ID = 1

    temp_val = 75 + random.randint(0,25)
    humid_val = 1000 - random.randint(0,250)
    press_val = 1000 + random.randint(0,350)
    
    sensor_data[0] = FEATHER_ID
    # Temperature data
    sensor_data[1] = (temp_val >> 8) & 0xff
    sensor_data[2] = temp_val & 0xff
    # Humidity data
    sensor_data[3] = (humid_val >> 8) & 0xff
    sensor_data[4] = humid_val & 0xff
    #Pressure data
    sensor_data[5] = (press_val >> 8) & 0xff
    sensor_data[6] = press_val & 0xff
    
    # For Sensor Specific Uses
    #try:
    #    sensor_data = func_timeout(30, use_encoder)
    #except FunctionTimedOut:
    #    sensor_data = [0]
    #except Exception as err:
    #    sensor_data = [0]
    #    print(err)

    cpu_val = int((psutil.cpu_percent(4) * 100))
    print('The CPU usage is: ', cpu_val)
    data_len = len(sensor_data)
    sensor_data.append(((cpu_val >> 8) & 0xff))
    sensor_data.append((cpu_val & 0xff))


    return sensor_data



    
