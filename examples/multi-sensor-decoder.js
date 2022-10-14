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
    var sensor1_dec_factor = 100;
    var sensor2_dec_factor = 100;
    var sensor3_dec_factor = 1;
    var payload_size = bytes.length;
    var sensor1_size = 0;
    var sensor2_size = 0;
    var sensor3_size = 0;

    if (exception == 1) {

    }
    else if (exception == 2){

    }
    else if (exception > 1000){
        exception = exception - 1000;
        exception_digits = splitToDigit(exception);
        // ['1','2','3']
        if (exception_digits[0] == 1){
            sensor1_reporter = false;
        }
        if (exception_digits[1] == 2){
            sensor2_reporter = false;
        }
        if (exception_digits[2] == 3){
            sensor3_reporter = false;
        }
    }

    var first_sensor_start = 2;
    var second_sensor_start = 2;
    var third_sensor_start = 2;

    if(sensor1_reporter){
        sensor1_size = 24;
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
        decoded.pm10_std = pm10_std_Int/sensor1_dec_factor;
        decoded.pm25_std = pm25_std_Int/sensor1_dec_factor;
        decoded.pm100_std = pm100_std_Int/sensor1_dec_factor;
        decoded.pm10_env = pm10_env_Int/sensor1_dec_factor;
        decoded.pm25_env = pm25_env_Int/sensor1_dec_factor;
        decoded.pm100_env_Int = pm100_env_Int/sensor1_dec_factor;
        decoded.part_03um = part_03um_Int/sensor1_dec_factor;
        decoded.part_05um = part_05um_Int/sensor1_dec_factor;
        decoded.part_10um = part_10um_Int/sensor1_dec_factor;
        decoded.part_25um = part_25um_Int/sensor1_dec_factor;
        decoded.part_50um = part_50um_Int/sensor1_dec_factor;
        decoded.part_100um_Int = part_100um_Int/sensor1_dec_factor;
    }
    if (sensor2_reporter){
        sensor2_size = 12;
        third_sensor_start = second_sensor_start+ sensor2_size;
        //decoded = decoded + decodedOPC(second_sensor_start,  bytes)
        var avg_pm1_Int = (bytes[second_sensor_start] << 8) | bytes[second_sensor_start+1];
        var avg_pm25_Int = (bytes[second_sensor_start+2] << 8) | bytes[second_sensor_start+3];
        var avg_pm10_Int = (bytes[second_sensor_start+4] << 8) | bytes[second_sensor_start+5];
        var temperature_Int = (bytes[second_sensor_start+6] << 8) | bytes[second_sensor_start+7];
        var humidity_Int = (bytes[second_sensor_start+8] << 8) | bytes[second_sensor_start+9];
        var laser_status_Int = (bytes[second_sensor_start+10] << 8) | bytes[second_sensor_start+11];

        // Decode int to float
        decoded.avg_pm1 = avg_pm1_Int/sensor2_dec_factor;
        decoded.avg_pm25  = avg_pm25_Int/sensor2_dec_factor;
        decoded.avg_pm10 = avg_pm10_Int/sensor2_dec_factor;
        decoded.temperature = temperature_Int/sensor2_dec_factor;
        decoded.humidity = humidity_Int/sensor2_dec_factor;
        decoded.laser_status = laser_status_Int/sensor2_dec_factor;
    }
    if (sensor3_reporter){
        sensor3_size = 14;
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
        decoded.mc_1p0 = mc_1p0_Int/sensor3_dec_factor;
        decoded.mc_2p5 = mc_2p5_Int/sensor3_dec_factor;
        decoded.mc_4p0 = mc_4p0_Int/sensor3_dec_factor;
        decoded.mc_10p0 = mc_10p0_Int/sensor3_dec_factor;
        decoded.ambient_rh = ambient_rh_Int/sensor3_dec_factor;
        decoded.ambient_t = ambient_t_Int/sensor3_dec_factor;
        decoded.voc_index = voc_index_Int/sensor3_dec_factor;

    }


    cpuInt = (bytes[payload_size-2] << 8) | bytes[payload_size-1];
    decoded.cpu = cpuInt/100;
 
    return decoded;
  }