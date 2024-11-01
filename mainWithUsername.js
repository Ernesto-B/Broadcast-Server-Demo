const WebSocket = require("ws");
const minimist = require("minimist");

const args = minimist(process.argv.splice(2));
const command = args._[0] || null;
const port = args.port || 3000;
const clientUsername = args.username || "Anon";

if (command === "start") {
    startServer();
} else if (command === "connect") {
    connectClient();
} else {
    console.log("Invalid command. Available commands: start, connect...\n");
}

function startServer() {
    const wss = new WebSocket.Server({ port });
    const clients = new Map(); // Use a Map to store clients and their usernames

    console.log(`Broadcast server started on port ${port}...\n`);

    // Handle new client connections
    wss.on("connection", (ws) => {
        let clientUsername = "Anon"; // Default username for new clients

        // Handle incoming messages from clients
        ws.on("message", (data) => {
            const message = JSON.parse(data); // Parse the incoming message as JSON

            // Check if the message is an introduction (username setup)
            if (message.type == "introduction") {
                clientUsername = message.username;
                clients.set(ws, clientUsername);
                console.log(`New client connected: ${clientUsername}`);
            } else if (message.type == "message") {
                console.log(`Received from ${clientUsername}: ${message.text}`);

                // Broadcast the message to all other connected clients
                clients.forEach((username, client) => {
                    if (client != ws && client.readyState == WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({ username: clientUsername, text: message.text })
                        );
                    }
                });
            }
        });

        // Handle client disconnections
        ws.on("close", () => {
            clients.delete(ws);
            console.log(`\nClient ${clientUsername} disconnected...\n`);
        });
    });
}

function connectClient() {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.on("open", () => {
        console.log("Connected to broadcasting server...\n");

        // Send an introduction message with the username
        ws.send(JSON.stringify({ type: "introduction", username: clientUsername }));

        // Send messages from user input
        process.stdin.on("data", (data) => {
            ws.send(JSON.stringify({ type: "message", text: data.toString().trim() }));
        });
    });

    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(`Broadcast message from ${parsedMessage.username}: ${parsedMessage.text}`);
    });

    ws.on("close", () => {
        console.log("Disconnected from the server...\n");
        process.exit(0);
    });

    ws.on("error", (error) => {
        console.error("Error:", error.message);
        process.exit(1);
    });
}
