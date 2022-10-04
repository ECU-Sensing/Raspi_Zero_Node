# Author: Colby Sawyer
# Multiple Sensor Implementation Example 
# It is recommended that you prepackage your data in a bytearray here so that you can have have a sketch for the decoder later
import psutil
from func_timeout import func_timeout, FunctionTimedOut
from devices.hydros import Hydros
from devices.opc import OPC
from devices.sen5x import Sen5x


# Or use the Library (Once its available)
# import ecu-sensing

def use_hydros():
    return Hydros().get_data()

def use_opc():
    return OPC().get_data()

def use_sen5x():
    return Sen5x().get_data()

def get_data():
    # Here is where you can add your sensor specific information. The driving code will use whatever data is here

    # For Sensor Specific Uses

    # Sensor 1 Data 
    sensor1_data = 0
    sensor2_data = 0
    sensor3_data = 0
    sensor_data = bytearray(2)

    #Store Exception Code
    exception = 0
    # Track Error States Entered (Important for Incomplete set sensor fail (ie. 2/3 fail))
    error_state_count = 0
    sensor1_state = False
    sensor2_state = False
    sensor3_state = False

    # Try to Read First Sensor
    try:
        sensor1_data = func_timeout(30, use_hydros)
        sensor1_state = True
    except FunctionTimedOut:
        exception = 11
        error_state_count += 1
    except Exception as err:
        exception = 1
        print(err)

    # Try to Read Second Sensor
    try:
        sensor2_data = func_timeout(30, use_opc)
        sensor2_state = True
    except FunctionTimedOut:
        exception = 12
        error_state_count += 1
    except Exception as err:
        exception = 1
        print(err)

    # Try to Read Third Sensor
    try:
        sensor3_data = func_timeout(30, use_sen5x)
        sensor3_state = True
    except FunctionTimedOut:
        exception = 13
        error_state_count += 1
    except Exception as err:
        exception = 1
        print(err)

    if error_state_count > 2:
        exception = 10

    # Exception to Start
    sensor_data[0] = (exception >> 8) & 0xff
    sensor_data[1] = exception & 0xff
    # Sensor 1
    if sensor1_state:
        sensor_data.append(sensor1_data)
    # Sensor 2
    if sensor2_state:
        sensor_data.append(sensor2_data)
    # Sensor 3
    if sensor3_state:
        sensor_data.append(sensor3_data)
    # CPU Stats
    cpu_val = int((psutil.cpu_percent(4) * 100))
    print('The CPU usage is: ', cpu_val)
    sensor_data.append(((cpu_val >> 8) & 0xff))
    sensor_data.append((cpu_val & 0xff))


    return sensor_data
