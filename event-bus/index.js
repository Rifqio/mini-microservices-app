const express = require("express");
const axios = require("axios").default;

const APP_PORT = 4005;
const APP_NAME = "[Event-Bus]";

const POST_SERVICE = "http://localhost:4000";
const COMMENT_SERVICE = "http://localhost:4001";
const QUERY_SERVICE = "http://localhost:4002";
const COMMENT_MODERATION_SERVICE = "http://localhost:4003";

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
    try {
        const event = req.body;
        console.log(`${APP_NAME} Received event ${event.type} data: ${JSON.stringify(event.data)}`);
        
        console.log(`${APP_NAME} Emitting event to Post Service`);
        await axios.post(`${POST_SERVICE}/events`, event);

        console.log(`${APP_NAME} Emitting event to Comment Service`);
        await axios.post(`${COMMENT_SERVICE}/events`, event);

        console.log(`${APP_NAME} Emitting event to Query Service`);
        await axios.post(`${QUERY_SERVICE}/events`, event);

        console.log(`${APP_NAME} Emitting event to Comment Moderation Service`);
        await axios.post(`${COMMENT_MODERATION_SERVICE}/events`, event);

        return res.json({ status: "OK" });
    } catch (error) {
        console.log(`${APP_NAME} ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

app.listen(APP_PORT, () => {
    console.log(`${APP_NAME} listening on port http://localhost:${APP_PORT} 🚀`);
});
