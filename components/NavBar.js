import Link from "next/link";
import {usePathname} from "next/navigation";
import {useRouter} from "next/router";
import {signIn, signOut, useSession} from "next-auth/react";

export default function NavBar() {
    const router = useRouter();
    const isActive = (pathname) => router.pathname === pathname;

    // Used to replace AuthContext
    const {data: session, status} = useSession();
    const user = session?.user || null
    const isAdmin = user?.role === "admin"
    const loading = status === "loading"


    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/"
                          className={isActive('/') ? 'active' : ''}
                          aira-current={isActive('/') ? 'page' : undefined}>Home</Link>
                </li>
                <li>
                    <Link href="/about"
                          className={isActive('/about') ? 'active' : ''}
                          aira-current={isActive('/about') ? 'page' : undefined}>About</Link>
                </li>
                <li>
                    <Link href="/blog"
                          className={isActive('/blog') ? 'active' : ''}
                          aira-current={isActive('/blog') ? 'page' : undefined}>Blog</Link>
                </li>
                {/*<li>*/}
                {/*    <Link href="/blog-ssg"*/}
                {/*          className={isActive('/blog-ssg') ? 'active' : ''}*/}
                {/*          aira-current={isActive('/blog-ssg') ? 'page' : undefined}>Blog-SSG</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link href="/blog-csr"*/}
                {/*          className={isActive('/blog-csr') ? 'active' : ''}*/}
                {/*          aira-current={isActive('/blog-csr') ? 'page' : undefined}>Blog-CSR</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link href="/blog/author/John/page/1"*/}
                {/*          className={router.pathname.startsWith('/blog/author') ? 'active' : ''}*/}
                {/*          aira-current={router.pathname.startsWith('/blog/author') ? 'page' : undefined}>Author</Link>*/}
                {/*</li>*/}

                <li style={{marginLeft: 'auto', display: 'flex', alightItems: 'center', gap: '1rem'}}>
                    {loading ? (
                       <span>Loading...</span>
                    ) : session ? (
                        <>
                        <span style={{color: 'white', fontsize: '0.9rem'}}>Hello, {user.email || user.name}</span>
                            {isAdmin && (
                                <Link href="/dashboard" className="admin-link">
                                    Admin Panel (Dashboard)
                                </Link>
                            )}
                            <Link href="/profile">Profile</Link>

                            <button onClick={() => signOut({callbackUrl: "/"})}
                            style={{fontsize: '0.85rem', padding: '0.4rem 0.8rem'}}
                            >Logout</button>
                        </>

                    ) : (
                        <>
                        <button onClick={() => signIn('gitlab')}
                        style={{
                            background: '#333',
                            color: 'white',
                            padding: '0.5rem 1 rem',
                            borderWeight: '600',
                            cursor: 'pointer'
                        }}
                        >Login with GitLab</button>
                        </>
                    )}
                </li>
            </ul>
        </nav>
    );
}