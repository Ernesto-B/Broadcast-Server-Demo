// const http = require("http");    // Not needed bc we are using web sockets, not a regular server
// const axios = require("axios");  // Not needed bc we are using web sockets, not a regular server

// NOTE, ws.on(<event>) sets up listeners, which in turn means Node will keep the program running as long as there are events to handle.

const WebSocket = require("ws")
const minimist = require("minimist");

const args = minimist(process.argv.splice(2));
const command = args._[0] || null;
const port = args.port || 3000;

if (command == "start") {
    startServer();
} else if (command == "connect") {
    connectClient();
} else {
    console.log("Invalid command. Available commands: start, connect...\n")
}


function startServer() {
    const wss = new WebSocket.Server({ port });
    const clients = new Set();

    console.log(`Broadcast server started on port ${port}...\n`);

    // ws.on("<event name>") the event names are keywords and preset by the ws lib
    wss.on("connection", (ws) => {
        clients.add(ws);
        console.log("\nNew client connected...\n");

        // Broadcast recieved message to all clients
        ws.on("message", (message) => {
            console.log(`Received: ${message}`);
            clients.forEach(client => {
                // Make sure client is not the server??
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);   // .send fires off the client's ws.on("message")
                }
            });
        });

        // Client disconnections
        ws.on("close", () => {
            clients.delete(ws);
            console.log("\nClient disconnected...\n");
        });
    });
}

function connectClient() {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.on("open", () => {
        console.log("Connected to broadcasting server...\n");

        process.stdin.on("data", (data) => {    // Convert the data to string since data here is a buffer (since it is read from iostream)
            ws.send(data.toString().trim());    // .send fires off server's ws.on("message")
        });
    });

    ws.on("message", (message) => {
        console.log(`Broadcast message: ${message}...`);
    });

    ws.on("close", () => {
        console.log("Disconnected form the server...\n");
        process.exit(0);
    });

    ws.on("error", (error) => {
        console.error("Error:", error.message);
        process.exit(1);
    });
}