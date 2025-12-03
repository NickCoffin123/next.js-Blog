import { useContext } from "react";
import { PostContext } from "./PostContext.js";
import Link from "next/link";
import {useAuth} from "@/components/AuthContext"

export default function PostList({
                                     posts: propPosts,
                                     page = 1,
                                     totalPosts,
                                     totalPages = 1,
                                     onPageChange
                                 }) {

    // Get posts from global PostContext
    const { posts: contextPosts, setPosts } = useContext(PostContext);
    const posts = propPosts || contextPosts || [];
    const {user} = useAuth()


    // Remove from UI without touching DB yet
    const handleRemove = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    // DELETE request to your API
    const handleDelete = async (postId) => {
        if (!confirm("Confirm Delete?")) return;

        try {
            const response = await fetch(
                `http://localhost:3000/api/posts?id=${postId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                handleRemove(postId); // update local state
            } else {
                alert("Failed to delete post.");
            }
        } catch (err) {
            alert("Network Error, Failed to DELETE");
        }
    };

    if (posts.length === 0) {
        return <p>No posts available</p>;
    }

    return (
        <div className="post-list">
            <h3>
                Blog Posts {totalPosts !== undefined && ` (Page ${page} of ${totalPages}, Total: ${totalPosts})`}
            </h3>

            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link href={`/blog/post/${post.id}`}>
                            <span>
                                {post.title} by {post.author} (ID: {post.id})
                            </span>
                        </Link>

                        {/* Only show Edit / Delete to author or admin */}
                        {(post.author === user?.email || user?.role === "admin") && (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Link
                                    href={`/dashboard/edit/${post.id}`}
                                    className="edit-link"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            {onPageChange && (
                <div className="pagination">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
