import {useContext, useEffect} from "react";
import {PostContext} from "@/components/PostContext";
import PostFilter from "@/components/PostFilter";
import PostList from "@/components/PostList";

export default function CategoryPage({posts, error, category, page, totalPosts, totalPages}) {

    const {setPosts} = useContext(PostContext);

    useEffect(() => {
        if (posts) setPosts(posts)
    }, [posts, setPosts]);

    return (
        <div className='content'>
            <section className='card'>
                <h1>Posts in {category}</h1>
                <PostFilter/>
                {error ? (
                    <p role="alert">{error}</p>
                ) : (
                    <PostList page={page} totalPosts={totalPosts} totalPages={totalPages}/>
                )}
            </section>
        </div>
    )


}

export async function getServerSideProps({params, query}) {
    const spadeId = process.env.CONTENFUL_SPACE_ID
    const accessToken = process.env.CONTENFUL_ACCESS_TOKEN
    const envId = process.env.CONTENFUL_ENV
    const contentType = 'post'
    const limit = 5
    const page = parseInt(query.page || '1', 10)
    const skip = (page - 1) * limit
    const category = params.category
    const url = `https://cdn.contentful.com/spaces/${spadeId}/environments/${envId}/entries?content_type${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}&fields.category[match]=${encodeURIComponent(category)}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("failed to fetch posts for category")
        }
        const data = await response.json()
        const posts = (data.items || []).map(item => (
            {
                id: item.sys.id,
                title: item.fields.title,
                content: item.fields.body,
                author: item.fields.author,
                category: item.fields.category,
                image: item.fields.image?.fields?.file?.url || null
            }

        ))

        const totalPosts = data.total || 0
        const totalPages = Math.ceil(totalPosts / limit)

        return {
            props: {
                posts,
                error: null,
                category,
                page,
                totalPosts,
                totalPages
            }
        }

    } catch (error) {
        console.error("Failed to fetch posts for category" + error.message)
        return {
            props: {
                posts: [],
                error: 'Failed',
                category,
                page: 1,
                totalPosts: 0,
                totalPages: 1
            }
        }
    }
}