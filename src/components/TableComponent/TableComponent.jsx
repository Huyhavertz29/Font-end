import React, { useMemo, useRef, useState } from 'react'
import { Table } from 'antd';
import Loading from '../LoadingComonent/Loading';
import { Excel} from "antd-table-saveas-excel";

const TableComponent = (props) => {

    const { selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnsExport = useMemo( () =>{
        const arr = columns?.filter((col) => col.dataIndex !=='action')
        return arr
    },[columns])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     name: record.name,
        // }),
    }

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }
    const exportExcel = () =>{
        const excel = new Excel();
        excel
            .addSheet("")
            .addColumns(newColumnsExport)
            .addDataSource(dataSource,{
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    }



    return (
        <Loading isLoading={isLoading} >
            {rowSelectedKeys.length > 0 && (
                <div style={{
                    background: '#1d1ddd',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px',
                    cursor: 'pointer'
                }}
                    onClick={handleDeleteAll}
                >
                    Xóa tất cả
                </div>
            )}
            <button onClick={exportExcel}>Export Excel</button>
              
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent
