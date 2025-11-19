import {PostContext} from "@/components/PostContext";
import {useContext, useEffect} from "react";
import PostList from "@/components/PostList";

export default function blogSSG({posts}){
    const {setPosts} = useContext(PostContext)

    useEffect(() => {
        if (posts){setPosts(posts)}
    }, [posts, setPosts])

    return(
        <section className="card">
            <h1>Blog - SSG + ISR</h1>
            <PostList posts={posts}/>
        </section>
    )
}

export async function getStaticProps() {
    const response = await fetch('http://localhost:3000/api/posts')
    const data = await response.json()

    return {
        props: {
            posts: data.posts || data.items || []
        },
        revalidate: 60,
    }
}
