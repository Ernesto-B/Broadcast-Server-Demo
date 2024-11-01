import time
from socket import *

# Server address and port
serverName = 'localhost'  # Replace with actual server IP
serverPort = 12000
clientSocket = socket(AF_INET, SOCK_DGRAM)

# Set a timeout of 1 second on the socket
clientSocket.settimeout(1)

sequence_number = 1
minRtt = float('inf')
maxRtt = 0
totalRtt = 0
successfulPings = 0
totalPings = 10
lostPackets = 0

# Send 10 pings
for sequence_number in range(1, totalPings + 1):
    # Prepare the ping message with sequence_number and current time
    sendTime = time.perf_counter()
    message = f'Ping {sequence_number} {sendTime}'
    
    try:
        # Record time before sending the message
        startTime = time.perf_counter()

        clientSocket.sendto(message.encode(), (serverName, serverPort))

        response, serverAddress = clientSocket.recvfrom(1024)

        # Record time when response was received
        endTime = time.perf_counter()

        # Calculate round-trip time (RTT) & update min and max RTT
        rtt = endTime - startTime
        totalRtt += rtt
        successfulPings += 1

        if rtt < minRtt:
            minRtt = rtt
        if rtt > maxRtt:
            maxRtt = rtt

        # Print the server's response and the RTT
        print(f'Ping {sequence_number}: Response from server: {response.decode()} RTT = {rtt:.6f} seconds')
    
    except timeout:
        # If no response is received within 1 second, print "Request timed out"
        print(f'Ping {sequence_number}: Request timed out')
        lostPackets += 1

clientSocket.close()

# Report statistics after all pings
if successfulPings > 0:
    averageRtt = totalRtt / successfulPings
else:
    averageRtt = 0

print(f"\n--- Ping statistics ---")
print(f"{totalPings} packets transmitted, {successfulPings} packets received, {lostPackets} packets lost ({(lostPackets / totalPings) * 100:.2f}% loss)")
print(f"Round-trip min/avg/max = {minRtt:.6f}/{averageRtt:.6f}/{maxRtt:.6f} seconds")
