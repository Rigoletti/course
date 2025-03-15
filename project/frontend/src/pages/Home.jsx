import React from "react";
import Header from "../companents/Header";
import VideoSection from "../companents/VideoSection";
import HomeSection from "../companents/HomeSection";
const Home=()=>{
  return(
<div>
      <div
        className="position-relative"
        style={{
          height: '100vh',
          overflow: 'hidden', 
        }}
      >
        <Header />
        <VideoSection />
      </div>
        <HomeSection />
     
    </div>
  )
}

export default Home;