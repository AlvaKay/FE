import React, { Component } from 'react';

class Footer extends Component {

    render() {
        return (
            <div class="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="footer-contact">
                                        <h2>Salon Address</h2>
                                        <p><i class="fa fa-map-marker-alt"></i>123 Street, New York, USA</p>
                                        <p><i class="fa fa-phone-alt"></i>+012 345 67890</p>
                                        <p><i class="fa fa-envelope"></i>info@example.com</p>
                                        <div class="footer-social">
                                            <a href=""><i class="fab fa-twitter"></i></a>
                                            <a href=""><i class="fab fa-facebook-f"></i></a>
                                            <a href=""><i class="fab fa-youtube"></i></a>
                                            <a href=""><i class="fab fa-instagram"></i></a>
                                            <a href=""><i class="fab fa-linkedin-in"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="footer-link">
                                        <h2>Quick Links</h2>
                                        <a href="">Terms of use</a>
                                        <a href="">Privacy policy</a>
                                        <a href="">Cookies</a>
                                        <a href="">Help</a>
                                        <a href="">FQAs</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-5">
                            <div class="footer-newsletter">
                                <h2>Newsletter</h2>
                                <p>
                                    Lorem ipsum dolor sit amet elit. Quisque eu lectus a leo dictum nec non quam. Tortor eu placerat rhoncus, lorem quam iaculis felis, sed lacus neque id eros.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;