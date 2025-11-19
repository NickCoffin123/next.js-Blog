import "@/styles/globals.css";
import "@/styles/index.css"
import {PostProvider} from "@/components/PostContext";
import {CategoryProvider} from "@/components/CategoryContext";
import Layout from "@/components/Layout";
import {AuthProvider} from "@/components/AuthContext";

export default function App({Component, pageProps}) {
    return (
        <PostProvider>
            <CategoryProvider>
                <AuthProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </AuthProvider>
            </CategoryProvider>
        </PostProvider>
    )
}
