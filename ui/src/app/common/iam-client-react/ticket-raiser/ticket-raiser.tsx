import { MessageOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, message, Modal, Radio, Row, Select, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import html2canvas from 'html2canvas';
import React, { useState } from 'react';
import './ticket-raiser.css';

// Define the interface for the ticket
interface Ticket {
    username: string;
    description: string;
    priority: string;
    screenshot: string | null;
    application: number;
}



interface TicketRaiserProps {
    appClientId: number; //  app_client_id
    apiEndpoint: string; // API endpoint for ticket submission
    applicationName: string
}

export const TicketRaiser: React.FC<TicketRaiserProps> = ({ appClientId, apiEndpoint, applicationName }) => {
    const [username] = useState('admin');
    const [isOpen, setIsOpen] = useState(false);
    const [ticketDetails, setTicketDetails] = useState<Ticket>({
        username: 'admin',
        description: '',
        priority: 'Low',
        screenshot: null,
        application: appClientId,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Toggle the ticket box
    const toggleTicketBox = async () => {
        if (!isOpen) {
            setIsOpen(true);

            const ticketRiser = document.querySelector('.ticket-riser') as HTMLElement;
            const tooltipElement = document.querySelector('.ant-tooltip') as HTMLElement;

            if (ticketRiser) {
                ticketRiser.style.display = 'none';
                tooltipElement.style.display = 'none';
            }

            // Capture a screenshot of the current screen
            const canvas = await html2canvas(document.body);
            const imgData = canvas.toDataURL('image/png');

            setTicketDetails((prevDetails) => ({
                ...prevDetails,
                screenshot: imgData,
            }));

            if (ticketRiser) {
                ticketRiser.style.display = 'block';
                tooltipElement.style.display = '';
            }
        } else {
            setIsOpen(false);
            setTicketDetails((prevDetails) => ({
                ...prevDetails,
                screenshot: null, // Reset screenshot when closing the ticket box
            }));
        }
    };
    function dataURLToBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            arrayBuffer[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
    }

    // Handle form submission
    const handleSubmit = async (values: { description: string; priority: string, isImageNeeded: boolean }) => {
        if (values.description.trim()) {
            const updatedTicket = {
                ...ticketDetails,
                description: values.description,
                priority: values.priority,
                subject: `Ticketing Bot Created from ${applicationName}`,

                //other fields from TicketCreationDTO sending as empty
                ticketId: null,
                serviceTicketId: null,
                contact: '',
                phoneNumber: '',
                category: null,
                assignedTo: null,
                supportEngineer: null,
                pcd: null,
                cc: '',
            };

            try {
                // Make an Axios POST request to submit the ticket
                const response = await axios.post(apiEndpoint + '/tickets/createFmsTicket', {
                    ...updatedTicket,
                    screenshot: null
                });

                //desPhotoUpload
                //createFmsTicket

                // Handle the success response
                if (response.status) {
                    message.success('Your ticket has been raised successfully!');
                    console.log('Sended data', updatedTicket);
                    console.log('Ticket Raised:', response.data);
                    if (values.isImageNeeded) {
                        ticketDetails.screenshot;
                        const formData = new FormData();
                        const blob = dataURLToBlob(ticketDetails.screenshot);
                        formData.append('file', blob, 'canvas-image.png');
                        formData.append('ticketId', `${response.data.data.ticketId}`);
                        await axios.post(apiEndpoint + '/tickets/desPhotoUpload', formData);
                    }

                    // Reset fields after successful submission
                    setIsOpen(false);
                    setTicketDetails({
                        username: 'admin',
                        description: '',
                        priority: 'Low',
                        screenshot: null,
                        application: appClientId,
                    });
                } else {
                    message.error('Failed to raise the ticket. Please try again.');
                }
            } catch (error) {
                // Handle error response
                message.error('An error occurred while raising the ticket.');
                console.error('Error:', error);
            }
        } else {
            message.error('Please provide a description for your ticket.');
        }
    };

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    return (
        <div className='ticket-riser'>
            {/* Floating button to open/close the ticket box */}
            <Tooltip title="Raise Ticket">
                <Button
                    type="primary"
                    shape="circle"
                    icon={<MessageOutlined />}
                    size="large"
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                    }}
                    onClick={toggleTicketBox}
                />
            </Tooltip>

            {isOpen && (
                <div className={`ticket-box ${isOpen ? 'open' : ''}`}>
                    <div className="ticket-header">
                        <span>Raising Ticket as {username}</span>
                        <button onClick={toggleTicketBox} className="close-button">
                            &#10005;
                        </button>
                    </div>

                    <div className="ticket-content">
                        {ticketDetails.screenshot && (
                            <div className="screenshot-container">
                                <img
                                    src={ticketDetails.screenshot}
                                    alt="Screenshot"
                                    className="screenshot"
                                    onClick={showModal}
                                    style={{ cursor: 'pointer', maxWidth: '200px' }}
                                />
                            </div>
                        )}

                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: 'Please describe your issue' }]}
                            >
                                <TextArea
                                    rows={4}
                                    value={ticketDetails.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setTicketDetails({ ...ticketDetails, description: e.target.value })
                                    }
                                    placeholder="Describe your issue..."
                                />
                            </Form.Item>
                            <Row justify='space-between'>
                                <Col><Form.Item
                                    label="Category"
                                    name="category"
                                    style={{ width: '100%' }}
                                >
                                    <Radio.Group >
                                        <Radio.Button value="3">CR</Radio.Button>
                                        <Radio.Button value="2">Bug</Radio.Button>
                                    </Radio.Group>
                                </Form.Item></Col>
                                <Col>
                                    <div style={{ display: 'flex',marginTop:'15px' }}>
                                        <label htmlFor="">Include Attachment</label>&nbsp;&nbsp;&nbsp;
                                        <Form.Item name="isImageNeeded" valuePropName="checked" label='Include Attachment' noStyle>
                                            <Checkbox />
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>



                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Submit Ticket
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}

            <Modal
                title="Screenshot"
                open={isModalVisible}
                footer={null}
                onCancel={handleCancel}
                width={800}
                styles={{ body: { maxHeight: '500px', overflow: 'auto' } }}
            >
                <img
                    src={ticketDetails.screenshot || ''}
                    alt="Screenshot"
                    style={{ maxWidth: '100%', maxHeight: '500px' }}
                />
            </Modal>
        </div>
    );
};

export default TicketRaiser;