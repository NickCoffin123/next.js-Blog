import {createContext, useState} from "react";
export const PostContext = createContext(null);

export function PostProvider({ children }) {
    const [posts, setPosts] = useState([
        { id: 1, title: "First Post", content: "This is the content of the first post." },
        { id: 2, title: "Second Post", content: "This is the content of the second post." },
    ]);

    const addPost = (title, content) => {
        const newPost = {
            id: posts.length + 1,
            title: title,
            content: content || "No content provided"
        }
    };

    const removePost = (id) => {
        setPosts(posts.filter((p) => p.id !== id));
    };

    return (
        <PostContext.Provider value={{ posts, setPosts, addPost, removePost }}>
            {children}
        </PostContext.Provider>
    );
}