import PostList from "@/components/PostList";
import {useContext, useEffect} from "react";
import {PostContext} from "@/components/PostContext";
import {useRouter} from "next/router";
import PostFilter from "@/components/PostFilter";

export default function Blog({posts, error, page, totalPosts, totalPages}) {

    const {setPosts} = useContext(PostContext);
    const router = useRouter()

    useEffect(() => {
        if (posts) setPosts(posts)
    }, [posts, setPosts]);

    const handlePageChange = (newPage) => {
        router.push(`/blog?page=${newPage}`);
    }

    return (


        <>
            <section className="card">
                <h1>Blog Posts</h1>
                <PostFilter/>
                {error ? (
                    <p role="alert">{error}</p>
                ) : (
                    <PostList
                        page={page}
                        totalPosts={totalPages}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>
        </>
    );
}


export async function getServerSideProps({query}) {

    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || 'master'
    const contentType = "post";

    const limit = 5;
    const page = parseInt(query.page || 1, 10);
    const skip = (page - 1) * limit;

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}`

    try {
        console.log("Fetching blog posts from Contentful API: " + url)
        const response = await fetch(url);

        if (!response.ok) {
            console.log("Failed to fetch posts", response.status, response.statusText)
            throw new Error("Failed to fetch posts")
        }

        const data = await response.json();
        console.log("Contentful API response ", data)
        if (!data.items || data.items.length === 0) {
            console.error("No published posts from Contentful");
            throw new Error("No published posts from Contentful")
        }

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