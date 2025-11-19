import {useContext, useEffect, useState} from "react";
import {PostContext} from "@/components/PostContext";
import PostList from "@/components/PostList";

export default function BlogCSR() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const {setPosts: setGlobalPosts} = useContext(PostContext)

    useEffect(() => {
        fetch('/api/posts')
            .then(r => r.json())
            .then(data => {
                setPosts(data.posts || data.items || [])
                setGlobalPosts(data.posts || data.items || [])
                setLoading(false)
            })
            .catch(error => {
                console.error('Fetch Failed: ', error)
                setLoading(false)
            })
    }, [setGlobalPosts]);

    if (loading) return <p>Loading posts, please wait...</p>

    return(
        <section className="card">
            <h1>Blog - CSR</h1>
            <PostList posts={posts}/>
        </section>
    )

}