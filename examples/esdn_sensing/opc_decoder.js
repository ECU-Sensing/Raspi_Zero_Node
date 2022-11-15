function Decoder(bytes, port) {
    var decoded = {};

    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var avg_pm1_Int = (bytes[2] << 8) | bytes[3];
        var avg_pm25_Int = (bytes[4] << 8) | bytes[5];
        var avg_pm10_Int = (bytes[6] << 8) | bytes[7];
        var temperature_Int = (bytes[8] << 8) | bytes[9];
        var humidity_Int = (bytes[10] << 8) | bytes[11];
        var laser_status_Int = (bytes[12] << 8) | bytes[13];

        // Decode int to float
        decoded.opc_avg_pm1 = avg_pm1_Int/100;
        decoded.opc_avg_pm25  = avg_pm25_Int/100;
        decoded.opc_avg_pm10 = avg_pm10_Int/100;
        decoded.opc_temperature = temperature_Int/100;
        decoded.opc_humidity = humidity_Int/100;
        decoded.opc_laser_status = laser_status_Int/100;
    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }