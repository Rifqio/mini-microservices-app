const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { randomBytes } = require("crypto");
const app = express();

app.use(cors());
app.use(express.json());

const APP_PORT = 4001;
const APP_NAME = "Comment-Service";

const EVENT_BUS_SERVICE = "http://localhost:4005";

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    res.json(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    try {
        const { content } = req.body;
        const { id } = req.params;
        const commentId = randomBytes(2).toString("hex");

        const comments = commentsByPostId[id] || [];

        comments.push({ id: commentId, content });

        commentsByPostId[id] = comments;

        console.log(`[${APP_NAME}, AddComment] Comment created for post ${id}`);

        console.log(`[${APP_NAME}, AddComment] Emitting event to event-bus`);
        await axios.post(`${EVENT_BUS_SERVICE}/events`, {
            type: "CommentCreated",
            data: {
                id: commentId,
                content,
                postId: id,
            },
        });
        res.status(201).json(comments);
    } catch (error) {
        console.log(`[${APP_NAME}, AddComment] ${error}`);
    }
});

app.post('/events', (req, res) => {
    console.log(`[${APP_NAME}, EventReceived] Received event ${req.body.type} data: ${JSON.stringify(req.body.data)}`);
    res.json({ status: "OK" });
});

app.listen(APP_PORT, () => {
    console.log(`[${APP_NAME}] listening on http://localhost:${APP_PORT}`);
});
