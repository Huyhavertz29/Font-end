import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import slider4 from '../../assets/images/slider4.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComonent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
  const searchProduct = useSelector((state) => state.product?.search || '')
  const searchDebounce = useDebounce(searchProduct, 800)
  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey?.[1]
    const search = context?.queryKey?.[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const { isPending, data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true
  })

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  // Reset limit khi search
  useEffect(() => {
    setLimit(6)
  }, [searchDebounce])

  const isLoadMoreDisabled = products?.total === products?.data?.length || products?.totalPage === 1

  return (
    <>
      <div style={{ width: '1270px', margin: '0 auto', padding: '10px 0' }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => (
            <TypeProduct name={item} key={item} />
          ))}
        </WrapperTypeProduct>
      </div>

      <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ padding: '20px 0', width: '1270px', margin: '0 auto' }}>
          <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />

          <Loading isLoading={isPending && !isPreviousData}>
            <WrapperProducts>
              {products?.data?.map((product) => (
                <CardComponent
                  key={product._id}
                  id={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                />
              ))}

              {/* Hiệu ứng loading khi load more */}
              {isPreviousData && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px' }}>
                  <Loading isLoading={true} />
                </div>
              )}
            </WrapperProducts>
          </Loading>

          {/* Nút Xem thêm */}
          {!isLoadMoreDisabled && !isPending && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <WrapperButtonMore
                textbutton={isPreviousData ? "Đang tải..." : "Xem thêm"}
                type="outline"
                styleButton={{
                  border: '1px solid rgb(11,116,229)',
                  color: isLoadMoreDisabled ? '#ccc' : 'rgb(11,116,229)',
                  width: '240px',
                  height: '38px',
                  borderRadius: '4px',
                  fontWeight: 500
                }}
                disabled={isLoadMoreDisabled}
                styletextbutton={{ 
                  fontWeight: 500,
                  color: isLoadMoreDisabled ? '#999' : 'rgb(11,116,229)'
                }}
                onClick={() => setLimit(prev => prev + 6)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HomePage