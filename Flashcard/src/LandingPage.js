import React from 'react'
import './css/LandingPage.css'

class LandingPage extends React.Component {
    render() {
      return (
        <div className='titlepage'>
            <div className='titleSection'>
              <div className='landing-title '>Welcome to Lango</div>
              <div className='landing-tagline'>Customize your vocabulary</div>
            </div>
            <div className='signInButton'>
              <div className='buttonPart'>
              <img src="/assets/google.jpg" alt="google"/>
                  Login with Google
             </div>
             </div>
         </div>
      );
    }
  }
  export default LandingPage
  