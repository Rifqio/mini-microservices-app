const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const APP_PORT = 4002;
const APP_NAME = '[Query-Service]'

const EVENT_TYPE = {
    POST_CREATED: 'PostCreated',
    COMMENT_CREATED: 'CommentCreated',
};

const posts = {};

app.get('/posts', (req, res) => {
    console.log(`${APP_NAME} Received request to get all posts`);
    res.json(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log(`${APP_NAME} Received event ${type} data: ${JSON.stringify(data)}`);

    if (type === EVENT_TYPE.POST_CREATED) {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === EVENT_TYPE.COMMENT_CREATED) {
        const { id, content, postId } = data;
        const post = posts[postId];
        post.comments.push({ id, content });
    }

    console.log(`${APP_NAME} Updated posts: ${JSON.stringify(posts)}`);

    res.json({ status: 'OK' });
});

app.listen(APP_PORT, () => {
    console.log(`${APP_NAME} listening on http://localhost:${APP_PORT} 🚀`);
});