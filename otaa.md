# LoRaWAN Procedure for OTAA (Ver 1.0.3)


## Procedure
1. Initiate Join-Requests multiple times
2. Upon receipt of Join-Accept we transition to sending Uplink with the session identifiers


## Overview
1. We generate a session (generates temporary keys for session)
2a. If session is lost we need to attempt re join
2b. If session is still active we can send data as an uplink