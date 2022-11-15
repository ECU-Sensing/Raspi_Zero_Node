function splitToDigit(n){
    return (n + '').split('').map((i) => { return Number(i); });
}

function Decoder(bytes, port) {
    var decoded = {};
    var cpuInt= 0;
    var int_tempInt = 0;
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;
    var sensor1_reporter = true;
    var sensor2_reporter = true;
    var sensor3_reporter = true;
    var payload_size = bytes.length;
    var sensor1_size = 0;
    var sensor2_size = 0;
    var sensor3_size = 0;

    if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
    else if (exception > 1000){
        exception = exception - 1000;
        exception_digits = splitToDigit(exception);
        // ['1','2','3']
        if (exception_digits.includes(1)){
            decoded.device_one = "Disconnected";
            decoded.pm25_pm10_std = null;
            decoded.pm25_pm25_std = null;
            decoded.pm25_pm100_std = null;
            decoded.pm25_pm10_env = null;
            decoded.pm25_pm25_env = null;
            decoded.pm25_pm100_env_Int = null;
            decoded.pm25_part_03um = null;
            decoded.pm25_part_05um = null;
            decoded.pm25_part_10um = null;
            decoded.pm25_part_25um = null;
            decoded.pm25_part_50um = null;
            decoded.pm25_part_100um_Int = null;
            sensor1_reporter = false;
        }
        if (exception_digits.includes(2)){
            decoded.device_two = "Disconnected";
            decoded.opc_avg_pm1 = null;
            decoded.opc_avg_pm25 = null
            decoded.opc_avg_pm10 =  null;
            decoded.opc_temperature =  null;
            decoded.opc_humidity =  null;
            decoded.opc_laser_status = null;
            sensor2_reporter = false;
        }
        if (exception_digits.includes(3)){
            decoded.device_three = "Disconnected";
            decoded.sen_mc_1p0 =  null;
            decoded.sen_mc_2p5 = null;
            decoded.sen_mc_4p0 = null;
            decoded.sen_mc_10p0 = null;
            decoded.sen_ambient_rh = null;
            decoded.sen_ambient_t = null;
            decoded.sen_voc_index = null;
            sensor3_reporter = false;
        }
    }

    var first_sensor_start = 2;
    var second_sensor_start = 2;
    var third_sensor_start = 2;

    if(sensor1_reporter){
        sensor1_size = 24;
        decoded.device_one = "Connected";
        second_sensor_start = sensor1_size + first_sensor_start;
        third_sensor_start = sensor1_size + first_sensor_start;
        //decoded = decoded + decodedPM25(first_sensor_start, bytes)
        var pm10_std_Int = (bytes[first_sensor_start] << 8) | bytes[first_sensor_start+1];
        var pm25_std_Int = (bytes[first_sensor_start+2] << 8) | bytes[first_sensor_start+3];
        var pm100_std_Int = (bytes[first_sensor_start+4] << 8) | bytes[first_sensor_start+5];
        var pm10_env_Int = (bytes[first_sensor_start+6] << 8) | bytes[first_sensor_start+7];
        var pm25_env_Int = (bytes[first_sensor_start+8] << 8) | bytes[first_sensor_start+9];
        var pm100_env_Int = (bytes[first_sensor_start+10] << 8) | bytes[first_sensor_start+11];
        var part_03um_Int = (bytes[first_sensor_start+12] << 8) | bytes[first_sensor_start+13];
        var part_05um_Int = (bytes[first_sensor_start+14] << 8) | bytes[first_sensor_start+15];
        var part_10um_Int = (bytes[first_sensor_start+16] << 8) | bytes[first_sensor_start+17];
        var part_25um_Int = (bytes[first_sensor_start+18] << 8) | bytes[first_sensor_start+19];
        var part_50um_Int = (bytes[first_sensor_start+20] << 8) | bytes[first_sensor_start+21];
        var part_100um_Int = (bytes[first_sensor_start+22] << 8) | bytes[first_sensor_start+23];
    
        // Decode int to float
        decoded.pm25_pm10_std = pm10_std_Int/100;
        decoded.pm25_pm25_std = pm25_std_Int/100;
        decoded.pm25_pm100_std = pm100_std_Int/100;
        decoded.pm25_pm10_env = pm10_env_Int/100;
        decoded.pm25_pm25_env = pm25_env_Int/100;
        decoded.pm25_pm100_env_Int = pm100_env_Int/100;
        decoded.pm25_part_03um = part_03um_Int/100;
        decoded.pm25_part_05um = part_05um_Int/100;
        decoded.pm25_part_10um = part_10um_Int/100;
        decoded.pm25_part_25um = part_25um_Int/100;
        decoded.pm25_part_50um = part_50um_Int/100;
        decoded.pm25_part_100um_Int = part_100um_Int/100;
    }
    if (sensor2_reporter){
        sensor2_size = 12;
        decoded.device_two = "Connected";
        third_sensor_start = second_sensor_start+ sensor2_size;
        //decoded = decoded + decodedOPC(second_sensor_start,  bytes)
        var avg_pm1_Int = (bytes[second_sensor_start] << 8) | bytes[second_sensor_start+1];
        var avg_pm25_Int = (bytes[second_sensor_start+2] << 8) | bytes[second_sensor_start+3];
        var avg_pm10_Int = (bytes[second_sensor_start+4] << 8) | bytes[second_sensor_start+5];
        var temperature_Int = (bytes[second_sensor_start+6] << 8) | bytes[second_sensor_start+7];
        var humidity_Int = (bytes[second_sensor_start+8] << 8) | bytes[second_sensor_start+9];
        var laser_status_Int = (bytes[second_sensor_start+10] << 8) | bytes[second_sensor_start+11];

        // Decode int to float
        decoded.opc_avg_pm1 = avg_pm1_Int/100;
        decoded.opc_avg_pm25  = avg_pm25_Int/100;
        decoded.opc_avg_pm10 = avg_pm10_Int/100;
        decoded.opc_temperature = temperature_Int/100;
        decoded.opc_humidity = humidity_Int/100;
        decoded.opc_laser_status = laser_status_Int/100;
    }
    if (sensor3_reporter){
        sensor3_size = 14;
        decoded.device_three = "Connected";
        //decoded = decoded + decodedSEN5x(third_sensor_start, bytes)
        // Decode bytes to int
        var mc_1p0_Int = (bytes[third_sensor_start] << 8) | bytes[third_sensor_start+1];
        var mc_2p5_Int = (bytes[third_sensor_start+2] << 8) | bytes[third_sensor_start+3];
        var mc_4p0_Int = (bytes[third_sensor_start+4] << 8) | bytes[third_sensor_start+5];
        var mc_10p0_Int = (bytes[third_sensor_start+6] << 8) | bytes[third_sensor_start+7];
        var ambient_rh_Int = (bytes[third_sensor_start+8] << 8) | bytes[third_sensor_start+9];
        var ambient_t_Int = (bytes[third_sensor_start+10] << 8) | bytes[third_sensor_start+11];
        var voc_index_Int = (bytes[third_sensor_start+12] << 8) | bytes[third_sensor_start+13];


        // Decode int to float
        decoded.sen_mc_1p0 = mc_1p0_Int/1;
        decoded.sen_mc_2p5 = mc_2p5_Int/1;
        decoded.sen_mc_4p0 = mc_4p0_Int/1;
        decoded.sen_mc_10p0 = mc_10p0_Int/1;
        decoded.sen_ambient_rh = ambient_rh_Int/1;
        decoded.sen_ambient_t = ambient_t_Int/1;
        decoded.sen_voc_index = voc_index_Int/1;

    }

    cpuInt = (bytes[payload_size-2] << 8) | bytes[payload_size-1];
    decoded.cpu = cpuInt/100;
 
    return decoded;
  }