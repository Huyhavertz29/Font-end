import { Col, Image, Rate, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import imageProductSmall from '../../assets/images/imgsmall.jpg'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuality, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct } from './style'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComonent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import * as message from '../MessageComponent/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'

const ProductDetailsCompopnent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
        // Không có return → trả về undefined → React Query báo lỗi đỏ!
    }
    // const fetchGetDetailsProduct = async (context) => {
    //     const id = context?.queryKey && context?.queryKey[1]
    //     if (id) {
    //         const res = await ProductService.getDetailsProduct(id)
    //         return res.data
    //     }
    // }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInStocks || (!orderRedux && productDetails?.countInStocks > 0)) {
            setErrorLimitOrder(false)
        } else if(productDetails?.countInStocks === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }

        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }

        }
    }
    // const { isPending, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })
    const { isPending, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct,
    })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInStocks || (!orderRedux && productDetails?.countInStocks > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInStocks: productDetails?.countInStocks
                    }
                }))
                
            } else {
                setErrorLimitOrder(true)
            }

        }
    }



    return (
        <Loading isLoading={isPending}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image product" preview={false} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={5}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={5}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={5}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={5}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>
                        {productDetails?.name}
                    </WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <span> Đã bán {productDetails?.selled || 1000}+ </span>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến</span>
                        <span className='address'>{user?.address}</span> -
                        <span className='change-address'> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <LikeButtonComponent 
                    dataHref={process.env.REACT_APP_LOCAL ? "https://developers.facebook.com/docs/plugins/"
                        : window.location.href
                    }
                     />
                    <div style={{ margin: "10px 0 20px", padding: '10px 0', borderTop: '1px solid #e5e5e5', borderbottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: "10px", }}>Số lượng</div>
                        <WrapperQuality>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)} >
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} defaultValue={1} value={numProduct} min={1} max={productDetails?.countInStocks} size='small' />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStocks)} >
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQuality>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgb(255,57,69',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                                textbutton={'Chọn mua'}
                                styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                onClick={handleAddOrderProduct}

                            ></ButtonComponent>
                            {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm hết hàng</div>}
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13,92,182)',
                                borderRadius: '4px'
                            }}
                            textbutton={'Mua trả sau'}
                            styletextbutton={{ color: 'rgb(13,92,182', fontSize: '15px' }}

                        />
                    </div>

                </Col>
                <CommentComponent  dataHref={ process.env.REACT_APP_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                    : window.location.href
                } width="1270" />
            </Row>
        </Loading>
    )
}

export default ProductDetailsCompopnent
