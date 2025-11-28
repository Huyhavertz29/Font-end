import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUpLoadFile } from './style'
import { Button, Form, Select, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { getBase64, renderOptions } from '../../utils'
import Loading from '../LoadingComonent/Loading'
import * as messages from '../../components/MessageComponent/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [typeSelect, setTypeSelect] = useState('')
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);
  const inittial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStocks: '',
    newType: '',
    discount: '',
  })


  const [stateProduct, setStateProduct] = useState(inittial())
  const [stateProductDetails, setStateProductDetails] = useState(inittial())


  const [form] = Form.useForm();


  const mutation = useMutationHooks(
    (data) => {
      const { name,
        price,
        description,
        rating,
        image,
        type,
        countInStocks,
        discount } = data
      const res = ProductService.createProduct({
        name,
        price,
        description,
        rating,
        image,
        type,
        countInStocks,
        discount
      })
      return res
    }
  )

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = ProductService.updateProduct(
        id,
        token,
        { ...rests })

      return res
    },

  )


  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token
      )

      return res
    },

  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = ProductService.deleteManyProduct(
        ids,
        token
      )

      return res
    },

  )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStocks: res?.data?.countInStocks,
        discount: res?.data?.discount
      })
    }
    setIsPendingUpdate(false)
    
  }


  useEffect(() => {
    if(!isModalOpen){
      form.setFieldsValue(stateProductDetails)
    }else{
      form.setFieldsValue(inittial())
    }
    
  }, [form, stateProductDetails,isModalOpen ])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true)
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_Token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany



  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const { isPending: isPendingProducts, data: products } = queryProduct
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  }

  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')

    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filter: [
        {
          text: '>= 50',
          value: '>=',
        },
        {
          text: '<=50',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 50
        }
        return record.price <= 50

      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filter: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '<= 3',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.rating) >= 3
        }
        return Number(record.rating) <= 3

      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })


  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      messages.success("Tạo sản phẩm thành công")
      handleCancel()
    } else if (isError) {
      messages.error("Có lỗi xảy ra")
    }
  }, [isSuccess])

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      messages.success()
    } else if (isErrorDeletedMany) {
      messages.error("Có lỗi xảy ra")
    }
  }, [isSuccessDeletedMany])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      messages.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      messages.error("Có lỗi xảy ra")
    }
  }, [isSuccessDeleted])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStocks: ''
    })
    form.resetFields()
  }


  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      messages.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      messages.error("Có lỗi xảy ra")
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }


  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_Token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStocks: '',
      discount: '',
    })
    form.resetFields()
  }
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStocks: stateProduct.countInStocks,
      discount: stateProduct.discount,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleOnChangeAvatar = async ({ fileList }) => {
    // 1️⃣ Nếu không có file nào
    if (!fileList || fileList.length === 0) {
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
    setStateProduct({
      ...stateProduct,
      image: file.preview || file.url

    })
    // 4️⃣ Cập nhật avatar (ưu tiên preview hoặc url)

  }

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user.accessToken, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const hanleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm </WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDeleteMany={handleDeleteManyProducts} columns={columns} isLoading={isPendingProducts} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          }
        }} />
      </div>
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null} >
        <Loading isLoading={isPending}>
          <Form
            name='basic'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}>
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}

            >
              <Select
                name='type'
                onChange={hanleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )}
            <Form.Item
              label="count inStock"
              name="countInStocks"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateProduct.countInStocks} onChange={handleOnchange} name="countInStocks" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Please input your rating!' }]}
            >
              <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
            >
              <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, message: 'Please input your discount of product!' }]}
            >
              <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUpLoadFile onChange={handleOnChangeAvatar} maxCount={1}>
                <Button>Select file</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUpLoadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type='primary' htmlType="submit">
                Submit
              </Button>
            </Form.Item>

          </Form>
        </Loading>

      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isPendingUpdate || isPendingUpdated}>
          <Form
            name='basic'
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}>
              <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}

            >
              <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
            </Form.Item>
            <Form.Item
              label="count inStock"
              name="countInStocks"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateProductDetails.countInStocks} onChange={handleOnchangeDetails} name="countInStocks" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Please input your rating!' }]}
            >
              <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
            >
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, message: 'Please input your discount of product!' }]}
            >
              <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUpLoadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <Button>Select file</Button>
                {stateProductDetails?.image && (
                  <img src={stateProductDetails?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUpLoadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type='primary' htmlType="submit">
                Apply
              </Button>
            </Form.Item>

          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
        <Loading isLoading={isPendingDeleted}>
          <div> Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>

      </ModalComponent>
    </div>
  )
}

export default AdminProduct
