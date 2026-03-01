import { CheckOutlined, EditOutlined, EyeOutlined, RightOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Switch, Divider, Drawer, Select, Descriptions, Radio } from 'antd';
import { AddressService, ApprovalUserService, DcService, DepartmentService, EmailService, } from '@gatex/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Highlighter from 'react-highlight-words'
import { AcceptReq, AcceptableEnum, ApprovalIdReq, AssignReq, CreateAddressDto, DcEmailModel, DcIdReq, DcReq, StatusEnum, ToAddressReq, UnitReq } from '@gatex/shared-models';
import DCForm from './dc-form';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import DescriptionsItem from 'antd/es/descriptions/Item';
const { Option } = Select;

export interface DcItemsFormProps {
    dcDetails: any;
}
export default function DcItemsForm({ dcDetails }) {
    const [formTwo] = Form.useForm();
    console.log(dcDetails, '---form details')
    return (
        <>
        {dcDetails?.map((item, index) => {
          console.log(item, 'item');
          return (
            <Card key={index}>
              <Form
                
                layout="vertical"
                initialValues={{
                  itemType: item.itemType,
                  itemCode: item.itemCode,
                  itemName: item.itemName,
                  description: item.description,
                  uom: item.uom,
                  qty: item.qty,
                  rate: item.rate,
                  amount: item.amount,
                }}
              >
                <h1 style={{ color: '#6b54bf', fontSize: '15px', textAlign: 'left' }}>ITEM DETAILS</h1>
                <Row gutter={14}>
                  <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    <Form.Item name='itemType' label='Item Type' rules={[{ required: true, message: 'Item Type required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    <Form.Item name='itemCode' label='Item Code' rules={[{ required: true, message: 'Item Code required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'Item Name is required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={6}>
                    <Form.Item name='description' label='Description' rules={[{ required: false, message: 'M3 Code is required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={2}>
                    <Form.Item name='uom' label='UOM' rules={[{ required: true, message: 'UOM is required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={2}>
                    <Form.Item name='qty' label='Qty' rules={[{ required: true, message: 'Qty required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={2}>
                    <Form.Item name='rate' label='Rate' rules={[{ required: true, message: 'Rate is required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                    <Form.Item name='amount' label='Amount' rules={[{ required: true, message: 'Amount is required' }]}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                    <Form.Item
                      name='returnQty'
                      label='Returning Qty'
                      rules={[
                        { required: true, message: 'Returning Qty is required' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const qty = getFieldValue('qty');
                            if (!value || value <= qty) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Returning Qty cannot be greater than Qty'));
                          },
                        }),
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                    <Form.Item name='returnRemarks' label='Return Remarks'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                    <Form.Item name='writeOffQty' label='Write Off Qty'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          );
        })}
      </>
    )
}