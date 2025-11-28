import React from 'react'
import ProductDetailsCompopnent from '../../components/ProductDetailsComponent/ProductDetailsCompopnent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ width: '100%', backgroundColor: '#efefef' }}>
      <div style={{width : '1270px', height: '100%', margin:'0 auto'}}>
        <h3><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Chi tiết sản phẩm</h3>
        <ProductDetailsCompopnent idProduct={id} />
      </div>

    </div>
  )
}

export default ProductDetailsPage
