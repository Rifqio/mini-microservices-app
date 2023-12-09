import { useEffect, useState } from "react";
import axios from "axios";
import { postServiceUrl } from "./constant";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

function PostLists() {
  const [posts, setPosts] = useState({});

  const fetchPost = async () => {
    const res = await axios.get(`${postServiceUrl}/posts`);
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
        <CommentCreate postId={post.id} />
        <CommentList postId={post.id} />
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
