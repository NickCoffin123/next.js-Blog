import {useContext} from "react";
import {PostContext} from "@/components/PostContext.js";
import {useRouter} from "next/router";
import PostDetail from "@/components/PostDetail";

export default function PostPage({error}) {
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

    if (error){
        return (
            <section className="card">
                <p role="alert">{error}</p>
            </section>
        )
    }

    if (!post)
        return (
        <section className="card">
            <p>Loading post, please wait...</p>
        </section>
    );

    return (
       <PostDetail post={post}/>
    );

}

