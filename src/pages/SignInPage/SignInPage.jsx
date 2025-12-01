import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image, Modal } from 'antd'
import imageLogo from '../../assets/images/loginlogo.png'
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComonent/Loading'
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import { message } from 'antd'  // Đảm bảo đã thêm contextHolder ở index.js

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // State cho modal quên mật khẩu
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emailForgot, setEmailForgot] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Mutation đăng nhập
  const mutation = useMutationHooks(data => UserService.loginUser(data))
  const { data, isPending, isSuccess } = mutation

  // Mutation quên mật khẩu
  const mutationForgot = useMutationHooks(data => UserService.forgotPassword(data))
  const { isPending: isPendingForgot, isSuccess: isSuccessForgot, data: dataForgot } = mutationForgot

  // Xử lý đăng nhập thành công
  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success('Bạn đã đăng nhập thành công!')
      
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))

      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, data?.access_token)
        }
      }

      if (location?.state) {
        navigate(location.state)
      } else {
        navigate('/')
      }
    } else if (data?.status === 'ERR') {
      message.error(data?.message || 'Đăng nhập thất bại!')
    }
  }, [isSuccess, data])

  // Xử lý quên mật khẩu thành công
  useEffect(() => {
    if (isSuccessForgot) {
      if (dataForgot?.status === 'OK') {
        message.success('Link đặt lại mật khẩu đã được gửi đến email của bạn!')
        setIsModalOpen(false)
        setEmailForgot('')
      } else {
        message.error(dataForgot?.message || 'Gửi email thất bại!')
      }
    }
  }, [isSuccessForgot, dataForgot])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  const handleSignIn = () => {
    mutation.mutate({ email, password })
  }

  const handleOpenForgot = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEmailForgot('')
  }

  const handleSendResetLink = () => {
    if (!emailForgot) {
      message.error('Vui lòng nhập email!')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(emailForgot)) {
      message.error('Email không hợp lệ!')
      return
    }
    mutationForgot.mutate({ email: emailForgot })
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
        <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
          <WrapperContainerLeft>
            <h1>Xin chào</h1>
            <p>Đăng nhập hoặc tạo tài khoản</p>

            <InputForm 
              style={{ marginBottom: "10px" }} 
              placeholder="abc@gmail.com" 
              value={email} 
              onChange={setEmail} 
            />

            <div style={{ position: 'relative' }}>
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                style={{ zIndex: 10, position: 'absolute', top: '14px', right: '8px', cursor: 'pointer' }}
              >
                {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
              <InputForm 
                placeholder="Mật khẩu" 
                type={isShowPassword ? "text" : "password"} 
                value={password} 
                onChange={setPassword} 
              />
            </div>

            <Loading isLoading={isPending}>
              <ButtonComponent
                disabled={!email || !password}
                onClick={handleSignIn}
                styleButton={{
                  background: 'rgb(255,57,69)',
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  margin: '26px 0 10px'
                }}
                textbutton={'Đăng nhập'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              />
            </Loading>

            <p style={{ margin: '10px 0' }}>
              <WrapperTextLight onClick={handleOpenForgot} style={{ cursor: 'pointer' }}>
                Quên mật khẩu?
              </WrapperTextLight>
            </p>
            <p>
              Chưa có tài khoản? <WrapperTextLight onClick={() => navigate('/sign-up')}>Tạo tài khoản</WrapperTextLight>
            </p>
          </WrapperContainerLeft>

          <WrapperContainerRight>
            <Image src={imageLogo} preview={false} alt="logo" width={203} height={203} />
            <h4 style={{ marginTop: 20 }}>Mua sắm tại Enzo Sport</h4>
          </WrapperContainerRight>
        </div>
      </div>

      {/* Modal Quên mật khẩu */}
      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: '600' }}>Quên mật khẩu?</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={420}
      >
        <p style={{ marginBottom: 20 }}>Nhập email để nhận link đặt lại mật khẩu:</p>
        <InputForm
          placeholder="Email của bạn"
          value={emailForgot}
          onChange={setEmailForgot}
          style={{ marginBottom: 20 }}
        />
        <ButtonComponent
          onClick={handleSendResetLink}
          loading={isPendingForgot}
          disabled={isPendingForgot}
          textbutton="Gửi link đặt lại"
          styleButton={{
            background: 'rgb(255,57,69)',
            height: '44px',
            width: '100%',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            fontWeight: '600'
          }}
        />
      </Modal>
    </>
  )
}

export default SignInPage