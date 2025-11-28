import React, { useEffect, useMemo, useState } from "react";
import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal } from "./style.js";
import { Button, Checkbox, Form, Radio } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils.js";
import ModalComponent from '../../components/ModalComponent/ModalComponent.jsx'
import InputComponent from "../../components/InputComponent/InputComponent.jsx";
import { useMutationHooks } from "../../hooks/useMutationHook.js";
import * as UserService from "../../services/UserService.js"
import Loading from "../../components/LoadingComonent/Loading.jsx";
import * as message from '../../components/MessageComponent/Message.jsx'
import { updateUser } from "../../redux/slides/userSlide.js";
import * as OrderService from '../../services/OrderService.js'
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as PaymentService from '../../services/PaymentService.js'


const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [delivery, setDelivery] = useState('fast')
    const [payment, setPayment] = useState('later_money')
    const navigate = useNavigate()
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    })
    const [form] = Form.useForm();

    const dispatch = useDispatch()



    useEffect(() => {
        form.setFieldValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpenModalUpdateInfo])


    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const discountPercent = cur.discount ? cur.discount : 0
            const discountValue = (cur.price * cur.amount * discountPercent) / 100
            return total + discountValue
        }, 0)

        return Number(result) || 0
    }, [order])


    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo > 200000) {
            return 10000
        } else if (priceMemo === 0) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])


    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSelected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                email: user?.email
            })
        }

    }

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,

                { ...rests }, token)

            return res
        },

    )

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)

            return res
        },

    )

    const { isPending, data } = mutationUpdate
    const { data: dataAdd, isPending: isPendingAddOrder, isSuccess, isError } = mutationAddOrder

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = []
            order?.orderItemsSelected?.forEach(element => {
                arrayOrdered.push(element.product)
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
            message.success('Đặt hàng thành công')
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo

                }
            })
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate({
            token: user?.access_token,
            orderItems: order?.orderItemsSelected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            isPaid: true,
            paidAt: details.update_time,
            email: user?.email
        })
    }

    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetails
        if (name && address && city && phone) {
            mutationUpdate.mutate({ id: user?.id, token: user?.accessToken, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleDilivery = (e) => {
        setDelivery(e.target.value)
    }

    const handlePayment = (e) => {
        setPayment(e.target.value)
    }





    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <Loading isLoading={isPendingAddOrder}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3>Chọn phương thức thanh toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handleDilivery} value={delivery}>
                                        <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                        <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handlePayment} value={payment}>
                                        <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value="paypal"> Thanh toán bằng Paypal</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div>
                                        <span>Địa chỉ: </span>
                                        <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`}</span>
                                        <span onClick={handleChangeAddress} style={{ color: 'blue', cursor: 'pointer' }}>Thay đổi</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Tạm tính</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Giảm giá</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Phí giao hàng</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(deliveryPriceMemo)}</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'rgb(254,56,52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            {payment === 'paypal' ? (
                                <div style={{ width: '320px' }}>
                                    <PayPalScriptProvider options={{ "client-id": "ARYzexF09ZSnGdAtByDNI1P6_XzWYBmxDxXG533byjhJnyt0FzzAoCgG38Xvjv6OpMMIGSGKlAJu9GHH", currency: "USD" }}>
                                        <div style={{ width: '320px' }}>
                                            <PayPalButtons
                                                style={{ layout: "vertical" }}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [{
                                                            amount: {
                                                                value: (Math.round(totalPriceMemo / 30000)).toFixed(2)
                                                            }
                                                        }]
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        onSuccessPaypal(details, data)
                                                    })
                                                }}
                                                onError={(err) => {
                                                    console.error(err)
                                                    alert("Paypal error")
                                                }}
                                            />
                                        </div>
                                    </PayPalScriptProvider>
                                </div>
                            ) : (
                                <ButtonComponent
                                    onClick={() => handleAddOrder()}
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255,57,69)',
                                        height: '48px',
                                        width: '320px',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                    textbutton={'Đặt hàng'}
                                    styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                            )}

                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInforUser}>
                    <Loading isLoading={isPending}>
                        <Form
                            name='basic'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            // onFinish={onUpdateUser}
                            autoComplete="on"
                            form={form}
                        >

                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}>
                                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                            </Form.Item>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: 'Please input your city!' }]}>
                                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="city" />
                            </Form.Item>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone!' }]}
                            >
                                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                            </Form.Item>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Please input your address!' }]}
                            >
                                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                            </Form.Item>
                        </Form>
                    </Loading>
                </ModalComponent>
            </Loading >
        </div >
    )
}

export default PaymentPage