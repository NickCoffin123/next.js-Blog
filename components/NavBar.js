import Link from "next/link";
import {usePathname} from "next/navigation";
import {useRouter} from "next/router";
import {useContext} from "react";
import {AuthContext} from "@/components/AuthContext";
import LoginForm from "@/components/LoginForm";

export default function NavBar() {
    const router = useRouter();
    const isActive = (pathname) => router.pathname === pathname;
    const {user, logout} = useContext(AuthContext);

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
                    {user ? (
                        <>
                         <span style={{color: 'white', fontsize: '0.9rem'}}>
                             Hello, {user.email}
                         </span>

                            {user.role === 'admin' && (
                                <Link href="/dashboard" className="dashboard-link">
                                    Admin Panel
                                </Link>
                            )}
                            <button onClick={logout} style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <LoginForm/>
                    )}
                </li>
            </ul>
        </nav>
    );
}