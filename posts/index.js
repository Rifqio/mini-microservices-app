const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const app = express();
const APP_PORT = 4000;
const APP_NAME = "Post-Service";
const EVENT_BUS_SERVICE = "http://localhost:4005";

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
    res.json(posts);
});

app.post("/posts", async (req, res) => {
    try {
        const { title } = req.body;
        const id = randomBytes(2).toString("hex");

        posts[id] = {
            id,
            title,
        };

        console.log(`[${APP_NAME}, AddPost] Post created with id ${id}`);

        console.log(`[${APP_NAME}, AddPost] Emitting event to event-bus`);
        await axios.post(`${EVENT_BUS_SERVICE}/events`, {
            type: "PostCreated",
            data: {
                id,
                title,
            },
        });

        res.status(201).json(posts[id]);
    } catch (error) {
        console.log(`[${APP_NAME}, AddPost] ${error}`);
    }
});

app.post('/events', (req, res) => {
    console.log(`[${APP_NAME}, EventReceived] Received event ${req.body.type} data: ${JSON.stringify(req.body.data)}`);
    res.json({ status: "OK" });
});

app.listen(APP_PORT, () => {
    console.log(`[${APP_NAME}] listening on http://localhost:${APP_PORT}`);
});
