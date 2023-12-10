/* eslint-disable react/prop-types */
function CommentList({ comments }) {
    const renderedComments = comments.map((comment) => {
        if (comment.status === 'pending') {
            return <li key={comment.id} style={{ fontStyle: 'italic' }}>Comment is awaiting moderation</li>;
        }
        if (comment.status === 'rejected') {
            return <li key={comment.id} style={{ fontStyle: 'italic' }}>Comment has been rejected</li>;
        }
        return <li key={comment.id}>{comment.content}</li>;
    });

    return <ul>{renderedComments}</ul>;
}

export default CommentList;
