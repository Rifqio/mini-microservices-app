const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const eventBusService = "http://localhost:4005";

const appPort = 4001;
const app = express();
app.use(cors());
app.use(express.json());

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

        console.log(`[Comment-Service, AddComment] Comment created for post ${id}`);

        console.log(`[Comment-Service, AddComment] Emitting event to event-bus`);
        await axios.post(`${eventBusService}/events`, {
            type: "CommentCreated",
            data: {
                id: commentId,
                content,
                postId: id,
            },
        });
        res.status(201).json(comments);
    } catch (error) {
        console.log(`[Comment-Service, AddComment] ${error}`);
    }
});

app.post('/events', (req, res) => {
    console.log(`[Comment-Service, EventReceived] Received event ${req.body.type} data: ${JSON.stringify(req.body.data)}`);
    res.json({ status: "OK" });
});

app.listen(appPort, () => {
    console.log(`[Comment-Service] listening on http://localhost:${appPort}`);
});
