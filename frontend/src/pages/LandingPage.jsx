import Hero from "../components/Hero";
import SignatureCollection from "../components/Signature";
import Story from "../components/Story";
import { useRef } from "react";
import Whywe from "../components/Whywe";


export default function LandingPage() {
    const storyRef = useRef(null);

    return (
        <>
            <div className="overflow-x-hidden"> 
                <Hero scrollToStory={() => storyRef.current.scrollIntoView({ behavior: "smooth" })} />
                <Story ref={storyRef} />
                <Whywe/>
                <SignatureCollection/>
            </div>


            
        </>

    );

}