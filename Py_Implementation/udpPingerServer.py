import random   # Used to generate randomized lost packets
from socket import *

# Create a UDP socket. Use SOCK_DGRAM for UDP packets
serverSocket = socket(AF_INET, SOCK_DGRAM)

port = 12000
# Assign IP address and port number to socket
serverSocket.bind(("", port))

while True:
    rand = random.randint(1, 10)
    # Receive the client packet along with the address it is coming from
    message, address = serverSocket.recvfrom(1024)
    # Capitalize the message from the client
    message = message.upper()
    # If rand is less is than 4, consider the packet lost and do not respond
    if rand < 4:
        continue
    # Otherwise respond
    serverSocket.sendto(message, address)
