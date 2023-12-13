const express = require('express');
const cors = require('cors');
const axios = require('axios').default;

const app = express();
app.use(express.json());
app.use(cors());

const APP_PORT = 4002;
const APP_NAME = '[Query-Service]'

const EVENT_BUS_SERVICE = 'http://eventbus-srv:4005';
const EVENT_TYPE = {
    POST_CREATED: 'Post::Created',
    COMMENT_CREATED: 'Comment::Created',
    COMMENT_UPDATED: 'Comment::Updated',
};

const posts = {};

const handleEvents = (type, data) => {
    console.log(`${APP_NAME} Received event ${type} data: ${JSON.stringify(data)}`);

    if (type === EVENT_TYPE.POST_CREATED) {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === EVENT_TYPE.COMMENT_CREATED) {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === EVENT_TYPE.COMMENT_UPDATED) {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        console.log(`${APP_NAME} Found post: ${JSON.stringify(post)}`);

        const comment = post.comments.find(comment => comment.id === id);
        console.log(`${APP_NAME} Found comment: ${JSON.stringify(comment)}`);

        comment.status = status;
        comment.content = content;
    }
    console.log(`${APP_NAME} Updated posts: ${JSON.stringify(posts)}`);
};

app.get('/posts', (req, res) => {
    console.log(`${APP_NAME} Received request to get all posts`);
    return res.json(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvents(type, data);
    return res.json({ status: 'OK' });
});

app.listen(APP_PORT, async () => {
    try {
        console.log(`${APP_NAME} listening on http://localhost:${APP_PORT} 🚀`);
        console.log(`${APP_NAME} Fetching events from event-bus`);
        const events = await axios.get(`${EVENT_BUS_SERVICE}/events`);

        for (let event of events.data) {
            console.log(`${APP_NAME} Processing event ${event.type}`);
            handleEvents(event.type, event.data)
        }
    } catch (error) {
        console.log(`${APP_NAME} ${error}`);
        throw error;
    }
});