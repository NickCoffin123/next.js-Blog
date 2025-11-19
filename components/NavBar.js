import NavLink from "next/link";
import {useRouter} from "next/router";
import Link from "next/link";

export default function NavBar({links}) {


    const router = useRouter()
    const {pathname} = router || {}

    const isActive = (pathname) => router.pathname === pathname


    return (

        < nav
            className="navbar">
            < ul>
                <li>
                    <Link href="/" className={isActive('/') ? 'active' : ''}
                          aria-current={isActive('/') ? 'page' : undefined}>Home</Link>
                </li>
                <li>
                    <Link href="/about" className={isActive('/about') ? 'active' : ''}
                          aria-current={isActive('/about') ? 'page' : undefined}>About</Link>
                </li>
                <li>
                    <Link href="/blog" className={isActive('/blog') ? 'active' : ''}
                          aria-current={isActive('/blog') ? 'page' : undefined}>Blog</Link>
                </li>
                {/*<li>*/}
                {/*    <Link href="/blog-ssg" className={isActive('/blog-ssg') ? 'active' : ''}*/}
                {/*          aria-current={isActive('/blog-ssg') ? 'page' : undefined}>Bog - SSG</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link href="/blog-csr" className={isActive('/blog-csr') ? 'active' : ''}*/}
                {/*          aria-current={isActive('/blog-csr') ? 'page' : undefined}>Blog - CSR</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link href="/blog/author/john/page/1" className={router.pathname.startsWith('/blog/author') ? 'active' : ''}*/}
                {/*          aria-current={router.pathname.startsWith('/blog/author') ? 'page' : undefined}>Author</Link>*/}
                {/*</li>*/}
            </ul>
        </nav>
    )
        ;
}
