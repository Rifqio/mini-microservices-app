const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { randomBytes } = require("crypto");
const app = express();

app.use(cors());
app.use(express.json());

const APP_PORT = 4001;
const APP_NAME = "Comment-Service";

const EVENT_BUS_SERVICE = "http://eventbus-srv:4005";
const EVENT_TYPE = {
    COMMENT_CREATED: "Comment::Created",
    COMMENT_MODERATED: "Comment::Moderated",
    COMMENT_UPDATED: "Comment::Updated",
};

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    return res.json(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    try {
        const { content } = req.body;
        const { id } = req.params;
        const commentId = randomBytes(2).toString("hex");

        const comments = commentsByPostId[id] || [];

        comments.push({ id: commentId, content, status: "pending" });

        commentsByPostId[id] = comments;

        console.log(`[${APP_NAME}, AddComment] Comment created for post ${id}`);

        console.log(`[${APP_NAME}, AddComment] Emitting event to event-bus`);
        await axios.post(`${EVENT_BUS_SERVICE}/events`, {
            type: EVENT_TYPE.COMMENT_CREATED,
            data: {
                id: commentId,
                content,
                postId: id,
                status: "pending",
            },
        });
        return res.status(201).json(comments);
    } catch (error) {
        console.log(`[${APP_NAME}, AddComment] ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/events', async (req, res) => {
    try {
        const { type, data } = req.body;
        console.log(`[${APP_NAME}, EventReceived] Received event ${type} data: ${JSON.stringify(data)}`);
    
        if (type === EVENT_TYPE.COMMENT_MODERATED) {
            const { postId, id, status } = data;
            console.log(`[${APP_NAME}, EventReceived] Updating comment status to ${EVENT_TYPE.COMMENT_UPDATED} from id ${data.id}`);
            const comments = commentsByPostId[postId];
            const comment = comments.find(comment => comment.id === id);
            
            comment.status = status;

            console.log(`[${APP_NAME}, EventReceived] Emitting event to event-bus`);
            await axios.post(`${EVENT_BUS_SERVICE}/events`, {
                type: EVENT_TYPE.COMMENT_UPDATED,
                data: {
                    id,
                    status,
                    postId,
                    content: comment.content
                }
            });
        }
    
        return res.json({ status: "OK" });
    } catch (error) {
        console.log(`[${APP_NAME}, EventReceived] ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

app.listen(APP_PORT, () => {
    console.log(`[${APP_NAME}] listening on http://localhost:${APP_PORT}`);
});
