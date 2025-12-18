import React from 'react'
import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
        <div className="footer__container">
            <div className="footer__row">
            <div className="footer__col footer__col--wide">
                <h6 className="footer__title">IT SQUAREHUB</h6>
                <p className="footer__text">
                 Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
            </div>



            <div className="footer__col footer__col--wide">
                <h6 className="footer__title">Contact US</h6>
                <p className="footer__text">G/F, Unit 5, Clark Center 09, Jose Abad Santos, Clark Freeport Zone, Central Luzon, Philippines</p>
                <p className="footer__text">info@gmail.com</p>
                <p className="footer__text">PH: +63 9060010784 (Globe)</p>
                <p className="footer__text">PH: +63 9218591348 (Smart)</p>
                <p className="footer__text">UK: +44 748 888-9923</p>
            </div>


            <div className="footer__col">
                <h6 className="footer__title">Follow Us</h6>

                <div className="footer__socials">
                <a className="footer__social footer__social--facebook"><i className="fab fa-facebook-f"></i></a>
                <a className="footer__social footer__social--twitter"><i className="fab fa-twitter"></i></a>
                <a className="footer__social footer__social--instagram"><i className="fab fa-instagram"></i></a>
                <a className="footer__social footer__social--linkedin"><i className="fab fa-linkedin-in"></i></a>
                </div>
            </div>

            </div>
        </div>

        <div className="footer__copyright">
        </div>
    </footer>

  )
}

export default Footer