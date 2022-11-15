function Decoder(bytes, port) {
    var decoded = {};
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var range_min = (bytes[2] << 8) | bytes[3];
        var range_max = (bytes[4] << 8) | bytes[5];
        var range_avg = (bytes[6] << 8) | bytes[7];
        var lux_min = (bytes[8] << 8) | bytes[9];
        var lux_max = (bytes[10] << 8) | bytes[11];
        var lux_avg = (bytes[12] << 8) | bytes[13];

        // Decode int to float
        decoded.range_min = range_min/100;
        decoded.range_max = range_max/100;
        decoded.range_avg = range_avg/100;
        decoded.lux_min = lux_min/100;
        decoded.lux_max = lux_max/100;
        decoded.lux_avg = lux_avg/100;

    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }