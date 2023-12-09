const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const app = express();
const appPort = 4000;
const eventBusService = "http://localhost:4005";

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

        console.log(`[Post-Service, AddPost] Post created with id ${id}`);

        console.log(`[Post-Service, AddPost] Emitting event to event-bus`);
        await axios.post(`${eventBusService}/events`, {
            type: "PostCreated",
            data: {
                id,
                title,
            },
        });

        res.status(201).json(posts[id]);
    } catch (error) {
        console.log(`[Post-Service, AddPost] ${error}`);
    }
});

app.post('/events', (req, res) => {
    console.log(`[Post-Service, EventReceived] Received event ${req.body.type} data: ${JSON.stringify(req.body.data)}`);
    res.json({ status: "OK" });
});

app.listen(appPort, () => {
    console.log(`[Post-Service] listening on http://localhost:${appPort}`);
});
