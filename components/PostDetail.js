export default function PostDetail({post}){

    return(
        <article className="card">
            <h1>{post.title}</h1>

            {post.image && (
                <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={400}
                    priority
                    sizes="(max-width: 760px) 100w, 800px"
                    style={{
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        width: '100%',
                        height: 'auto'
                    }}
                    />
            )}

            <p><strong>Author: </strong>{post.author}</p>
            <p><strong>Category: </strong>{post.category}</p>

            <div
                dangerouslySetInnerHTML={{__html: post.content}}
                style={{lineHeight: '1.7', marginTop: '1rem'}}
            ></div>

        </article>
    )

}