function splitToDigit(n){
    return (n + '').split('').map((i) => { return Number(i); });
}

function Decoder(bytes, port) {
    var decoded = {};
    var dec_factor = 100
  
    var cpuInt= 0;
    var int_tempInt = 0;
    var exception = (bytes[0] << 8) | bytes[1];
    decoded.exception= exception;
      
    if (exception = 0){
            depthInt = (bytes[2] << 8) | bytes[3];
            decoded.depth = depthInt/dec_factor;
      
            temperatureInt = (bytes[4] << 8) | bytes[5];
            decoded.temp = temperatureInt/dec_factor;
      
            conductInt = bytes[6] << 8) | bytes[7];
            decoded.conduct = coductInt/dec_factor;
    }

    cpuInt = (bytes[payload_size-4] << 8) | bytes[payload_size-3];
    decoded.cpu = cpuInt/dec_factor;
  
    internalTempInt = (bytes[payload_size-2] << 8) | bytes[payload_size-1];
    decoded.int_temp = cpuInt/dec_factor;
 
    return decoded;
  }
