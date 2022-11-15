function Decoder(bytes, port) {
    var decoded = {};
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var longitude_degrees = (bytes[2] << 8) | bytes[3];
        var longitude_minutes = (bytes[4] << 8) | bytes[5];
        var latitude_degrees = (bytes[6] << 8) | bytes[7];
        var latitude_minutes = (bytes[8] << 8) | bytes[9];
        var satellites = (bytes[10] << 8) | bytes[11];

        // Decode int to float
        decoded.longitude_degrees = longitude_degrees/100;
        decoded.longitude_minutes = longitude_minutes/100;
        decoded.latitude_degrees = latitude_degrees/100;
        decoded.latitude_minutes = latitude_minutes/100;
        decoded.satellites = satellites/100;

    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }