import NavLink from "next/link";
import {useRouter} from "next/router";

export default function NavBar({links}) {


    const router = useRouter()
    const {pathname} = router || {}


    return (

        < nav
            className="navbar">
            < ul>
                {
                    links.map((link, index) => {

                        const href = link === 'Home' ? '/' : `/${link.toLowerCase()}`

                        const isActive = pathname === href || (link === 'Blog' && pathname.startsWith('/blog'))

                        return (

                            <li key={link}>
                                <NavLink
                                    href={href} aria-current={isActive ? 'page' : undefined}
                                >
                                    {link}
                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
        ;
}
