# Broadcast-Server-Demo
The purpose of this project is to demonstrate a simple WebSocket-based broadcast server, in turn learning about JS' event loop and its WebSocket lib.

This project is a WebSocket-based broadcast server that allows multiple clients to connect and communicate in real-time. Clients can send messages that are broadcasted to all other connected clients, similar to chat applications or real-time notifications.

## Features
- **Broadcast Server**: Listens for incoming WebSocket connections and broadcasts their messages to all connected clients.
- **Real-time Communication**: Clients can send and receive messages in real-time.
- **Named Clients**: Clients can introduce themselves with a username for personalized communication.
- **Smooth Client Disconnections**: Handles clients connecting and disconnecting smoothly.

## Project Structure
- `main.js`: Basic WebSocket server and client implementation without named clients.
- `mainWithUsername.js`: Enhanced WebSocket server and client implementation with support for client usernames.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. Clone this repository or download the source code.
2. Navigate to the project directory.
3. Install dependencies:
```bash
   npm install
```
## JS Implementation Usage

### 1. Start the WebSocket server:
```bash
    node main.js start --port <port_number>
```
- `--port` (optional): The port number to run the server on. Default is `3000`.
<br>
OR

```bash
    node mainWithUsername.js start --port <port_number>
```
- `--port` (optional): The port number to run the server on. Default is `3000`.



### 2. Connect a client in another terminal:
```bash
    node main.js connect --port <port_number>
```
- `--port:` Optional. Specifies the port to connect to. Defaults to 3000.
- `--username:` Optional. Sets the client's username. Defaults to Anon.
<br>
OR

```bash
    node mainWithUsername.js connect --port <port_number> --username <username>
```
- `--port:` (optional). Specifies the port to connect to. Defaults to 3000.
- `--username:` (optional). Sets the client's username. Defaults to Anon.
### 3. Send messages from the client terminals.

## Python Implementation Usage
### 1. Start the WebSocket server:
```bash
    python3 udpPingerServer.py
```
- Will run on port `12000` by default.

### 2. Connect a client in another terminal:
```bash
    python3 udpPingerClient.py
```
- Will connect to the server on port `12000` by default.
