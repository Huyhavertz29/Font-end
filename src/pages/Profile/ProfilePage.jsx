import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUpLoadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComonent/Loading'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/MessageComponent/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'



const ProfilePage = () => {

    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            return UserService.updateUser(id, rests, access_token)
        }
    )
    const dispatch = useDispatch()
    const { data, isPending, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success('')
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])


    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnChangeAvatar = async ({ fileList }) => {
        // 1️⃣ Nếu không có file nào
        if (!fileList || fileList.length === 0) {
            setAvatar('')
            return
        }

        // 2️⃣ Lấy file đầu tiên trong danh sách
        const file = fileList[0]
        if (!file) return

        // 3️⃣ Nếu file chưa có preview
        if (!file.url && !file.preview) {
            const realFile = file.originFileObj || file
            file.preview = await getBase64(realFile)
        }

        // 4️⃣ Cập nhật avatar (ưu tiên preview hoặc url)
        setAvatar(file.preview || file.url)
    }
    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông tin người dùng </WrapperHeader>
            <Loading isLoading={isPending} >
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email" >Email</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnChangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid rgb(26,148,255)',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styletextbutton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor="name" >Name</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnChangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid rgb(26,148,255)',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styletextbutton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone" >Phone</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="phone" value={phone} onChange={handleOnChangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid rgb(26,148,255)',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styletextbutton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar" >Avatar</WrapperLabel>
                        <WrapperUpLoadFile onChange={handleOnChangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select file</Button>
                        </WrapperUpLoadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar" />
                        )}
                        {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnChangeAvatar} /> */}
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid rgb(26,148,255)',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styletextbutton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address" >Address</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnChangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid rgb(26,148,255)',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textbutton={'Cập nhật'}
                            styletextbutton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage
