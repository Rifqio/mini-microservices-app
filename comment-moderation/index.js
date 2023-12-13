const express = require("express");
const axios = require("axios").default;

const app = express();
app.use(express.json());

const APP_PORT = 4003;
const APP_NAME = "CommentModeration-Service";

const EVENT_BUS_SERVICE = "http://eventbus-srv:4005";
const EVENT_TYPE = {
    COMMENT_CREATED: "Comment::Created",
    COMMENT_MODERATED: "Comment::Moderated",
};

const COMMENT_STATUS = {
    APPROVED: "approved",
    REJECTED: "rejected",
};

app.post('/events', async (req, res) => {
    try {
        const { type, data } = req.body;
        console.log(`[${APP_NAME}, EventReceived] Received event ${type} data: ${JSON.stringify(data)}`);
    
        // Example of simple comment moderation with certain wordlist
        if (type === EVENT_TYPE.COMMENT_CREATED) {
            const status = data.content.includes('orange') ? COMMENT_STATUS.REJECTED : COMMENT_STATUS.APPROVED;
            console.log(`[${APP_NAME}, EventReceived] Emmiting event to event-bus, type: ${EVENT_TYPE.COMMENT_MODERATED}, data: ${JSON.stringify(data)}`);
            
            await axios.post(`${EVENT_BUS_SERVICE}/events`, {
                type: EVENT_TYPE.COMMENT_MODERATED,
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content
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