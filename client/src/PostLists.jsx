import { useEffect, useState } from "react";
import axios from "axios";
import { QUERY_SERVICE_URL } from "./constant";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

function PostLists() {
  const [posts, setPosts] = useState({});

  const fetchPost = async () => {
    const res = await axios.get(`${QUERY_SERVICE_URL}/posts`);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const generatePosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
        </div>
        <CommentList comments={post.comments} />
        <CommentCreate postId={post.id} />
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {generatePosts}
    </div>
  );
}

export default PostLists;
