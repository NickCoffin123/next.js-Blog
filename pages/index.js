import {useContext, useEffect} from "react";
import {PostContext} from "@/components/PostContext";
import Counter from "@/components/Counter";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import {useRouter} from "next/router";


export default function Home({posts, error, page, totalPosts, totalPages}) {

    const { setPosts } = useContext(PostContext)
    const router = useRouter()

    useEffect(() => {
        if (posts) setPosts(posts);
    }, [posts, setPosts])

    const handlePageChange = (newPage) => {
        router.push(`/blog?page=${newPage}`)
    }

    return (
        <>
                <section className="card">
                    <Counter/>
                </section>

                <section className="card">
                    <PostForm/>
                </section>

                <section className="card">
                    {error ? (
                        <p role="alert">{error}</p>
                    ) : (
                        <PostList
                            page={page}
                            totalPosts={totalPosts}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>

                <section className="card">
                    <h1>Hello React</h1>
                    <p>Welcome to the blog!!</p>
                    <img
                        src="/assets/images/placeholder.webp"
                        alt="Blog Placeholder"
                        width="300"
                        height="200"/>
                </section>
           </>

    )
}

export async function getServerSideProps({query}){
    const spaceId = process.env.CONTENTFUL_SPACE_ID
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
    const contentType = "post"
    const envId = process.env.CONTENTFUL_ENV || 'master'

    const limit = 5
    const page = parseInt(query.page || '1', 10)
    const skip = (page - 1) * limit

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}`

    try {
        console.log("Fetching blog posts from Contentful API: " + url)
        const res = await fetch(url)

        if (!res.ok){
            throw new Error("Failed to fetch Contentful posts")
        }

        const data = await res.json()

        const posts = (data.items || []).map((item) => {
            return {
                id: item.sys.id,
                title: item.fields.title,
                content: item.fields.body,
                author: item.fields.author,
                image: item.fields.image?.fields?.file?.url || null
            }
        });

        const totalPosts = data.total || 0;
        const totalPages = Math.ceil(totalPosts / limit)

        return {
            props: {
                posts,
                error: null,
                page,
                totalPosts,
                totalPages
            }
        }

    } catch (error) {
        console.error("Error in getStaticProps ", error.message)
        return {
            props: {
                posts: null,
                error: "Failed to fetch posts",
                page: 1,
                totalPosts: 0,
                totalPages: 1
            }
        }
    }

}
