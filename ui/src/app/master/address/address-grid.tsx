import { SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip } from 'antd';
import { AddressService } from 'libs/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words'

const AddressGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
    const service = new AddressService();
    const [page, setPage] = React.useState(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        getAddress();
    }, []);

    const getAddress = () => {
        service.getAllAddress().then((res: any) => {
            if (res.status) {
                setResponseData(res.data);
            }
        });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button size="small" style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters)
                        setSearchedColumn(dataIndex);
                        confirm({ closeDropdown: true });
                    }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            )
                : null
    })

    
    const columnsSkelton: any  = [
        {
            title: 'S No',
            key: 'sno',
            width: 60,
            responsive: ['sm'],
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "Addresser",
            dataIndex: "addresser",
            ...getColumnSearchProps('addresser')
        },

        {
            title: "Addresser Name",
            dataIndex: "addresserName"
        },
        {
            title: "Line One",
            dataIndex: "lineOne"
        },

        {
            title: "Line Two",
            dataIndex: "lineTwo"
        },
        {
            title: "City",
            dataIndex: "city"
        },

        {
            title: "Dist",
            dataIndex: "dist"
        },
        {
            title: "Pin Code",
            dataIndex: "pinCode"
        },
        {
            title: "State",
            dataIndex: "state"
        },

        {
            title: "Country",
            dataIndex: "country"
        },

    ];
    


    return (
        <Card
                title={<span style={{ color: "white" }}>Address</span>}
                extra={
                    (
                        <Link to="/address-form">
                            <span style={{ color: "white" }}>
                                <Button>Create </Button>{" "}
                            </span>
                        </Link>
                    )
                }

                headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}>

            <Table columns={columnsSkelton} dataSource={responseData}></Table>
        </Card>
    );
};

export default AddressGrid;