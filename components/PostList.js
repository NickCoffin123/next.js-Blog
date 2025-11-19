import {useContext} from "react";
import {PostContext} from "./PostContext.js";
import Link from "next/link";

export default function PostList({
                                     posts: propPosts,
                                     page = 1,
                                     totalPosts,
                                     totalPages = 1,
                                     onPageChange
                                 }) {

    const {posts: contextPosts, setPosts, removePost} = useContext(PostContext);
    const posts = propPosts || contextPosts || []

    return (
        <div className="post-list">
            <h3>Blog Posts - {`Page ${page} of ${totalPages}, Total Posts: ${totalPosts}`}</h3>
            <ul>
                {posts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/blog/post/${post.id}`}>
                                <span>{post.title} by {post.author} (ID: {post.id})</span>
                            </Link>
                            <button onClick={() => removePost(post.id)} aria-label={`Remove ${post.title}`}>
                                Remove
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {onPageChange && (

                <div className="pagination">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >Back
                    </button>

                    <span>Page {page} of {totalPages}</span>

                    <button
                        disabled={page >= totalPages} onClick={() => (onPageChange(page + 1))}
                    >Next
                    </button>

                </div>
            )}

        </div>
    );
}


