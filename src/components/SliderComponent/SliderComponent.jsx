import { Image } from 'antd';
import React from 'react'
import Slider from 'react-slick';
import { WrapperSliderStyle } from './style';
const SliderComponent = ({ arrImages }) => {
    const setting ={
        dots: true,
        infinite: true,
        speed: 500,
        slideToShow: 1,
        slideToScroll:1,
        autoplay: true,
        autoplaySpeed : 10000
    };
    return (
        <WrapperSliderStyle {...setting}>
            {arrImages.map((image) => {
                return(
                    <Image key={image} src={image} alt="slider" preview={false} width="100%" />
                )
            })}
        </WrapperSliderStyle>
  )
}

export default SliderComponent
