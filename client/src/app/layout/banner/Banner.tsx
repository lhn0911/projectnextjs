import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function page() {
  const carouselItems = [
    {
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/z5818462150952_cde5599a153ecc46098f27f42eba854a.jpg?alt=media&token=61b8d703-1fb8-4878-b22c-8361e6912c8b",
    },
    {
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/z5818462171258_31a355ad3dc64e2973173622e5ddb68c.jpg?alt=media&token=f0daefe0-8282-4e39-9b8f-0d61319381c0",
    },
    {
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/z5818462235953_36606a0510bf21a531a36dd843dca7c3.jpg?alt=media&token=1fbe0f60-72c2-4d0d-8b02-888a4f8f2806",
    },
    {
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/z5818462236183_d6d8f7320eb627de98561a895dab317f.jpg?alt=media&token=2cfed7c8-ae9c-4a0f-aa11-2cc2dff27f4c",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };
  return (
    <div>
      <Slider {...settings}>
        {carouselItems.map((item, index) => (
          <div key={index}>
            <img
              style={{
                height: "400px",
                display: "block",
                overflow: "hidden",
                width: "100%",
              }}
              src={item.imgPath}
              alt=""
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
