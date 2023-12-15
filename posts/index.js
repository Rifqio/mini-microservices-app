const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const app = express();
const APP_PORT = 4000;
const APP_NAME = "Post-Service";
const EVENT_BUS_SERVICE = "http://eventbus-srv:4005";

app.use(cors());
app.use(express.json());

const EVENT_TYPE = {
    POST_CREATED: "Post::Created",
}
const posts = {};

app.post("/posts/create", async (req, res) => {
    try {
        const { title } = req.body;
        const id = randomBytes(3).toString("hex");

        posts[id] = {
            id,
            title,
        };

        console.log(`[${APP_NAME}, AddPost] Post created with id ${id}`);

        console.log(`[${APP_NAME}, AddPost] Emitting event to event-bus`);
        await axios.post(`${EVENT_BUS_SERVICE}/events`, {
            type: EVENT_TYPE.POST_CREATED,
            data: {
                id,
                title,
            },
        });

        res.status(201).json(posts[id]);
    } catch (error) {
        console.log(`[${APP_NAME}, AddPost] ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/events', (req, res) => {
    console.log(`[${APP_NAME}, EventReceived] Received event ${req.body.type} data: ${JSON.stringify(req.body.data)}`);
    return res.json({ status: "OK" });
});

app.listen(APP_PORT, () => {
    console.log(`[${APP_NAME}] listening on http://localhost:${APP_PORT}`);
});
