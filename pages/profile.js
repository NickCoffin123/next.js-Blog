import {useSession} from "next-auth/react";
import Link from "next/link";

export default function Profile(){

    const {data: session, status} = useSession();

    if (status === 'loading'){
        return(
            <section className="card">
                <p>Loading Profile...</p>
            </section>
        );
    }

    if (!session){
        return (
            <section className="card">
                <h1>Profile</h1>
                <p>You are not logged in.</p>
                <p>Go to{' '}
                <Link href="/" style={{color: '#0070f3', textDecoration: 'underline'}}>
                    Home
                </Link>
                     And click login with GitLab
                </p>
            </section>
        )
    }

    if (session){
        return(
            <section className="card">
                <h1>User Profile</h1>
                <p><strong>Email: </strong>{session.user.email}</p>
                <p><strong>Role: </strong>{session.user.role || 'author'}</p>
                <hr style={{margin: '1.5rem 0', border: '1px solid #eee'}}/>
                <p><em>This data indicates that our GitLab auth provider is working</em></p>
            </section>
        )
    }
}