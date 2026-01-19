import '../styles/Carousel.css'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { footerUrl } from "../data/globalData";

export default function Carousel() {
    const settings = {
        dots: true,          // show navigation dots
        infinite: true,      // loop forever
        speed: 500,          // transition speed
        slidesToShow: 1,     // one image at a time
        slidesToScroll: 1,   // scroll one at a time
        autoplay: true,      // auto play
        autoplaySpeed: 2500, // 2.5 seconds
    };

    return (
        <div className="footer-carousel">
            <Slider {...settings}>
                {footerUrl.map(item =>
                    <div key={item.id} className="carousel-item wow animate__animated animate__fadeInRight">
                        <img src={item.url} alt={`footer-${item.id}`} />
                    </div>)}
            </Slider>
        </div>
    );
}