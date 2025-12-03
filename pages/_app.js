import "@/styles/globals.css";
import "@/styles/index.css"
import {PostProvider} from "@/components/PostContext";
import {CategoryProvider} from "@/components/CategoryContext";
import Layout from "@/components/Layout";
import {AuthProvider} from "@/components/AuthContext";
import {SessionProvider} from "next-auth/react";

export default function App({Component, pageProps}) {
    return (
        <SessionProvider>
            <PostProvider>
                <CategoryProvider>
                    <AuthProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </AuthProvider>
                </CategoryProvider>
            </PostProvider>
        </SessionProvider>
    )
}
