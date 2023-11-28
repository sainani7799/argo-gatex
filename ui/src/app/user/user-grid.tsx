
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserManagementServices } from 'libs/shared-services/src';



const UserFormGrid = () => {
    const [data, setData] = useState([]);

    const [searchedText, setSearchedText] = useState<any>([])
    const [isEditing, setIsEditing] = useState<any>(false);
    const [editingData, setEditingData] = useState<any>();
    const [responseData, setResponseData] = useState<any>([]);
    const service = new UserManagementServices();
    const [loading, setLoading] = useState(true);
    const { Search } = Input;

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        service.getUsers().then((res: any) => {
            console.log(res, '................................')
            if (res) {
                setResponseData(res)
            }
            setLoading(false);
        });
    };



    const columns = [

        // { title: ' ID', dataIndex: 'id', key: '1' },
        {
            key: "1",
            title: "User Name",
            dataIndex: "userName",
            //filteredValue: [String(searchedText).toLowerCase()],
            // onFilter: (value: any, record: any) => {
            //     const aaa = new Set(Object.keys(record).map((key) => {
            //         return String(record[key]).toLowerCase().includes(value.toLocaleString())
            //     }))
            //     if (aaa.size && aaa.has(true))
            //         return true;
            //     else
            //         return false;
            // },
        },
        {
            key: "2",
            title: "Employee Name",
            dataIndex: "employee_name",
        },
        {
            key: "3",
            title: "Employee Code",
            dataIndex: "employee_code",
        },
        {
            key: "4",
            title: "Email",
            dataIndex: "email_id",
        }

        // { title: 'Password', dataIndex: 'password', key: '3' },
        // {
        //     key: "4",
        //     title: "Role",
        //     dataIndex: "role",
        // },


        // {
        //     key: "8",
        //     title: "Actions",
        //     render: (record: any) => {
        //         function onDelete(record: any) {
        //             throw new Error('Function not implemented.');
        //         }

        //         return (
        //             <>
        //                 <EditOutlined style={{ color: 'blue' }}


        //                     onClick={() => {
        //                         onEdit(record)
        //                         console.log(record, "record")
        //                     }} />
        //                 <Popconfirm
        //                     okText={'ok'}
        //                     cancelText={'cancel'}
        //                     onConfirm={e => {
        //                         onDelete(record);
        //                     }}
        //                     title={'are u want to delete'}>
        //                     <DeleteOutlined style={{ color: 'red' }} />
        //                 </Popconfirm>
        //             </>
        //         )
        //     }
        // },
    ]

    const onEdit = (record: any) => {
        setIsEditing(true)
        setEditingData({ ...record })
    }

    const resetEditing = () => {
        setIsEditing(false)
        setEditingData(null)
    }

    // const onDelete = (record: any) => {
    //     axios.delete(`http://localhost:5000/userdata/deletedata/${record.id}`)
    //         .then((res) => {
    //             if (res) {
    //                 setData((res: any) => {
    //                     return res.filter((e: any) => e.id !== record.id)
    //                 })
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error.response);
    //             alert(error.response.data.message);
    //         })
    // }
    // console.log(data, "last");

    // const onSearch = (value: any) => {
    //     console.log(data)
    // };

    return (
        <div>
            <Card
                title={<span style={{ color: "white" }}>User Data</span>}
                extra={
                    (
                        <Link to="/form9">
                            <span style={{ color: "white" }}>
                                <Button>Create </Button>{" "}
                            </span>
                        </Link>
                    )
                }

                headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}>
                {/* <Input.Search placeholder="Search" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />, */}

                <Table columns={columns} dataSource={responseData}></Table>
            </Card>

        </div>
    )
}

export default UserFormGrid;