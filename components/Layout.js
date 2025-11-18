import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import Footer from "@/components/Footer";

export default function Layout({children}){
    return(
        <div className="app-container">
            <Header title="My blog platform"/>
            <NavBar links={['Home', 'About', 'Blog']}/>
            <SideBar/>
            <main className='content'>
                {children}
            </main>
            <Footer/>
        </div>
    )
}