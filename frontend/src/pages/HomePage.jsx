import CustomerSection from "../components/customer-cat";
import FeaturedProducts from "../components/Features";
import FlashSale from "../components/FlashSale";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Home from "../components/Home";


export default function HomePage() {
    
    

    return (
        <div className=" overflow-x-hidden">
            <Header />
            <Home/>
            <FeaturedProducts/>
            <FlashSale/>
            <CustomerSection/>
            <Footer />

        </div>
    );

}