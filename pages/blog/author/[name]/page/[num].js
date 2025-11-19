import {useContext, useEffect} from "react";
import {PostContext} from "@/components/PostContext";
import PostList from "@/components/PostList";

export default function AuthorPage({posts, author, page}) {

    const {setPosts} = useContext(PostContext)

    useEffect(() => {
        if (posts) setPosts(posts)
    }, [posts, setPosts])

    return (
        <section className='card'>
            <h1>Posts by {author} - Page {page}</h1>
            <PostList
                posts={posts}
                page={page}
                totalPosts={posts.length}
                totalPages={1}/>
        </section>
    )
}

export async function getServerSideProps({params}){

    const {name} = params

    const response = await fetch(`http://localhost:3000/api/posts?author=${encodeURIComponent(name)}`)

    const data = await response.json()

    return {
        props: {
            posts: data.posts || data.items || [],
            author: name,
            page: 1,
        }
    }

}