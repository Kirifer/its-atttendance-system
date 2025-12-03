import React from 'react'
import "../styles/Footer.css";

function Footer() {
  return (
    <footer class="footer">
        <div class="footer__container">
            <div class="footer__row">
            <div class="footer__col footer__col--wide">
                <h6 class="footer__title">IT SQUAREHUB</h6>
                <p class="footer__text">
                 Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
            </div>



            <div class="footer__col footer__col--wide">
                <h6 class="footer__title">Contact US</h6>
                <p class="footer__text">G/F, Unit 5, Clark Center 09, Jose Abad Santos, Clark Freeport Zone, Central Luzon, Philippines</p>
                <p class="footer__text">info@gmail.com</p>
                <p class="footer__text">PH: +63 9060010784 (Globe)</p>
                <p class="footer__text">PH: +63 9218591348 (Smart)</p>
                <p class="footer__text">UK: +44 748 888-9923</p>
            </div>


            <div class="footer__col">
                <h6 class="footer__title">Follow Us</h6>

                <div class="footer__socials">
                <a class="footer__social footer__social--facebook"><i class="fab fa-facebook-f"></i></a>
                <a class="footer__social footer__social--twitter"><i class="fab fa-twitter"></i></a>
                <a class="footer__social footer__social--instagram"><i class="fab fa-instagram"></i></a>
                <a class="footer__social footer__social--linkedin"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>

            </div>
        </div>

        <div class="footer__copyright">
        </div>
    </footer>

  )
}

export default Footer