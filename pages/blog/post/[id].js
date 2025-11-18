"use strict"
import {useContext} from "react";
import {PostContext} from "@/components/PostContext.js";
import {useRouter} from "next/router";
import Image from "next/image";

export default function PostDetail() {
    const router = useRouter();
    const {id} = router.query;
    const {posts} = useContext(PostContext);

    console.log("PostDetail: Router query ID: ", id);
    console.log("PostDetail: PostContext posts: ", posts);

    const postID = parseInt(id, 10);
    const post = posts.find((p) => p.id === id);

    const handleBack = () => {
        router.push("/blog");
    }

    if (!post) return <h2>Post not found</h2>;

    return (
        <>
            <section className="card">
                {post ? (
                    <div>
                        <h2>{post.title}</h2>
                        <p>{post.author}</p>
                        <p>{post.content}</p>
                        <p>{post.category}</p>
                        {post.image && (
                            <Image src={post.image} alt={post.title} width={600} height={400}/>
                        )}
                        <button onClick={handleBack}>
                            Back to Blog Page
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>Post Not Found</h2>
                        <p>The post with the id {id} does not exist</p>
                        <button onClick={handleBack}>
                            Back to Blog Page
                        </button>
                    </>
                )}
            </section>
        </>
    );

}

