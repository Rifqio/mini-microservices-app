/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { commentServiceUrl } from "./constant";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`${commentServiceUrl}/${postId}/comments`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
}

export default CommentList;
