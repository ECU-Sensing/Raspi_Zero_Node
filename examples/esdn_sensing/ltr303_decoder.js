function Decoder(bytes, port) {
    var decoded = {};
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var visible_light = (bytes[2] << 8) | bytes[3];
        var infrared_light = (bytes[4] << 8) | bytes[5];

        // Decode int to float
        decoded.visible_light = visible_light/100;
        decoded.infrared_light  = infrared_light/100;

    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }