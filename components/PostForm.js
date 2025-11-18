import {useContext, useState} from "react";
import {useRouter} from "next/navigation";
import {CategoryContext} from "@/components/CategoryContext";

export default function PostForm() {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [author, setAuthor] = useState('')
    const [category, setCategory] = useState('Tech')
    const {categories} = useContext(CategoryContext)

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && body && author && category) {
            try {
                const response = await fetch('api/posts',
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            title,
                            body,
                            author,
                            category
                        })
                    });

                if (!response.ok) {
                    const text = await response.text()
                    throw new Error(text || "Failed to create post: " + response.status)
                }

                setTitle("")
                setAuthor("")
                setBody("")
                setCategory('Tech')

                router.push('/blog')

            } catch (error) {

                console.error("Error submitting post: " + error.message)
                alert("Failed to create post: " + error.message)
            }
        }
    }


    return (
        <form className="post-form" onSubmit={handleSubmit}>

            <h3>Create a Blog</h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title here!"
                aria-label="Post Title"
            />
            <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter post body here!"
                aria-label="Post Body"
            />
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter post author here!"
                aria-label="Post Author"
            />
            <button type="submit">Submit Post</button>

        </form>
    );


}

