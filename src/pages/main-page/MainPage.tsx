import './MainPage.css'

import MainNavbar from '../../components/main-navbar/MainNavbar'
import MainHeader from '../../components/main-header/MainHeader'
import FeatureCard from '../../components/feature-card/FeatureCard'

import foxCasinoImage from '../../assets/FoxCasino.png'
import varietyImage from '../../assets/Variety.png'

function MainPage() {
    return (
        <div className='main-page-container'>
            <MainHeader />
            <MainNavbar />
            <div className='main-page-content ms-auto me-auto'>
                <h2>Watch Live on VarietyTV!</h2>
                <p>The official website for the CFT. Check out the latest news and 
                    victims that have been desecrated in the octagon. Catch up on highlights form last 
                    nights torture presented to you by our presidents: Double H and Fireflake. And yes 
                    there is a belt that can only be won by them. And yes one point in time one of the 
                    president had the CFT belt. We're not narcissistic.
                </p>
                <FeatureCard />
                <h2>Powered By</h2>
                <div className='main-page-image-display'>
                    <img src={varietyImage} className='main-page-image' />
                    <img src={foxCasinoImage} className='main-page-image' />
                </div>
            </div>
            <footer><i>CFT Version: v1.8.0 (The Snapshot Update DELUXE Part 1)</i></footer>
        </div>
    )
}

export default MainPage