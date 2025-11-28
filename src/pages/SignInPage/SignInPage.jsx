import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import imageLogo from '../../assets/images/loginlogo.png'
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComonent/Loading'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const { data, isPending, isSuccess } = mutation

  useEffect(() => {
    if(isSuccess){
      if(location?.state){
        Navigate(location?.state)
      }else{
        Navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token)
        console.log('decode', decoded)
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id,data?.access_token)
        }
      }
    }
  },[isSuccess])

  const handleGetDetailsUser = async (id,token) =>{
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id,token)
    dispatch(updateUser({...res?.data, access_token: token, refreshToken}))
    console.log('res', res)
  }

  console.log('mutation', mutation)

  const handleNavigateSignUp = () => {
    Navigate('/sign-up')
  }
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }
  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
    console.log('sign-in:', email, password)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm style={{ marginBottom: "10px" }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'

              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }

            </span>
            <InputForm placeholder="Password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword} />

          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
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
            ></ButtonComponent>
          </Loading>
          <p><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p>
          <p>Chưa có tài khoản ? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="700" />
          <h4>Mua sắm tại Enzo sport</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage
