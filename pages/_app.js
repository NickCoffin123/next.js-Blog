import "@/styles/globals.css";
import "@/styles/index.css"
import {PostProvider} from "@/components/PostContext";
import {CategoryProvider} from "@/components/CategoryContext";
import Layout from "@/components/Layout";

export default function App({Component, pageProps}) {
    return (
        <PostProvider>
            <CategoryProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </CategoryProvider>
        </PostProvider>
    )
}
