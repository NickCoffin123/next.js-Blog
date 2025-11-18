export default function Header( {title} ){

    return(

        <header className="header">
            {/* Use props to display title dynamically */}
            <h2>{title}</h2>
        </header>
    );
}
