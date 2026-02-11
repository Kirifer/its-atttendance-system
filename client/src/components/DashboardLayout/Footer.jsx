import React from "react";
import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__row">
          <div className="footer__col footer__col--wide">
            <h6 className="footer__title">IT SQUAREHUB</h6>
            <p className="footer__text">
              Tracking and managing attendance effortlessly.
            </p>
          </div>

          <div className="footer__col footer__col--wide">
            <h6 className="footer__title">Contact US</h6>
            <p className="footer__text footer__address">
              <span>G/F, Unit 5, Clark Center 09,</span>
              <span> Jose Abad Santos,</span>
              <span> Clark Freeport Zone,</span>
              <span> Central Luzon, Philippines</span>
            </p>
            <p className="footer__text">info@gmail.com</p>
            <p className="footer__text">PH: +63 9060010784 (Globe)</p>
            <p className="footer__text">PH: +63 9218591348 (Smart)</p>
            <p className="footer__text">UK: +44 748 888-9923</p>
          </div>

          <div className="footer__col">
            <h6 className="footer__title">Follow Us</h6>

            <div className="footer__socials">
              <a
                className="footer__social footer__social--facebook"
                href="https://www.facebook.com/people/ITSquarehub/100090140784001"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
                <img src="facebook-logo.png" />
              </a>

              <a
                className="footer__social footer__social--twitter"
                href="https://twitter.com/ITSquarehub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
                <img src="twitter-logo.png" />
              </a>

              <a
                className="footer__social footer__social--instagram"
                href="https://www.instagram.com/it_squarehub/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
                <img src="instagram-logo.png" />
              </a>

              <a
                className="footer__social footer__social--linkedin"
                href="https://www.linkedin.com/company/itsquarehub/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
                <img src="linkedin-logo.png" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__copyright"></div>
    </footer>
  );
}

export default Footer;
