function Decoder(bytes, port) {
    var decoded = {};
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var uv = (bytes[2] << 8) | bytes[3];
        var ambient_light = (bytes[4] << 8) | bytes[5];
        var uvi = (bytes[6] << 8) | bytes[7];
        var lux = (bytes[8] << 8) | bytes[9];

        // Decode int to float
        decoded.uv = uv/100;
        decoded.infrared_light = ambient_light/100;
        decoded.uvi = uvi/100;
        decoded.lux = lux/100;

    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }