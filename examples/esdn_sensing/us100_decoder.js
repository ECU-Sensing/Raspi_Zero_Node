function Decoder(bytes, port) {
    var decoded = {};
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var distance = (bytes[2] << 8) | bytes[3];
        var temperature = (bytes[4] << 8) | bytes[5];

        // Decode int to float
        decoded.distance = distance/100;
        decoded.temperature  = temperature/100;

    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }