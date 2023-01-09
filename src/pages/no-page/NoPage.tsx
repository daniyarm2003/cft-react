import './NoPage.css'

import MainNavbar from '../../components/main-navbar/MainNavbar'

function NoPage() {
    return (
        <div className='no-page-container'>
            <MainNavbar />
            <div className='no-page-content'>
                <h1>Error 404: This page was not found</h1>
                <p>Perhaps you may have mistyped the URL? Or I just decided to move the webpage for no reason lol.</p>
            </div>
        </div>
    )
}

export default NoPage