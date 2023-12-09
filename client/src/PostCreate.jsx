import { useState } from "react";
import axios from "axios";
import { postServiceUrl } from "./constant";

function PostCreate() {
  const [title, setTitle] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${postServiceUrl}/posts`, {
      title,
    });
    setTitle("");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-3"
        />
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}

export default PostCreate;
