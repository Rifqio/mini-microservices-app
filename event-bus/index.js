const express = require("express");
const axios = require("axios").default;

const port = 4005;
const postServiceUrl = "http://localhost:4000";
const commentServiceUrl = "http://localhost:4001";
const queryServiceUrl = "http://localhost:4002";

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
    try {
        const event = req.body;
        console.log(`[Event-Bus] Received event ${event.type} data: ${JSON.stringify(event.data)}`);
        
        console.log(`[Event-Bus] Emitting event to Post Service`);
        await axios.post(`${postServiceUrl}/events`, event);

        console.log(`[Event-Bus] Emitting event to Comment Service`);
        await axios.post(`${commentServiceUrl}/events`, event);

        console.log(`[Event-Bus] Emitting event to Query Service`);
        await axios.post(`${queryServiceUrl}/events`, event);

        res.json({ status: "OK" });
    } catch (error) {
        console.log(`[Event-Bus] ${error}`);
    }
});

app.listen(port, () => {
    console.log(`[Event-Bus] listening on port http://localhost:${port} 🚀`);
});
