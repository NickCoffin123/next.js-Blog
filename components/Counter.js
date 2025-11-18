import {useState} from "react";

export default function Counter() {

    const [count, setCount] = useState(0)

    return (
        <div className="counter">
            <h3>Likes: {count}</h3>

            <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => setCount(count + 1)}>👍 Like</button>
                <button onClick={() => setCount(count - 1)}>👎 Dislike</button>
            </div>

        </div>
    );

}