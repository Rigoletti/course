import React from "react";
import Header from "../../companents/layout/Header";
import VideoSection from "../../companents/home/VideoSection";
import HomeSection from "../../companents/home/HomeSection";
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