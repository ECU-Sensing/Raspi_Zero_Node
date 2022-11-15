function Decoder(bytes, port) {
    var decoded = {};
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;

    if (exception == 0){
        var broken = (bytes[2] << 8) | bytes[3];
        var total_breaks = (bytes[4] << 8) | bytes[5];

        // Decode int and boolean
        decoded.broken = Boolean(broken);
        decoded.total_breaks  = total_breaks;

    }
    else if (exception == 1) {
        decoded.status = "Fatal Device State Exception";
    }
    else if (exception == 2){
        decoded.status = "Fatal CPU State Exception";
    }
 
    return decoded;
  }