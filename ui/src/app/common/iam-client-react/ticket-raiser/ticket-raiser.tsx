import { MessageOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, message, Modal, Radio, Row, Select, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import html2canvas from 'html2canvas';
import React, { useRef, useState } from 'react';
import './ticket-raiser.css';
import helpDeskLog from './helpx-logo.png';


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
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [editedScreenshot, setEditedScreenshot] = useState<string | null>(null);


    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

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
                    message.success(`Your ticket with Id #${response.data.data.ticketId} has been raised successfully`);
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

    // Start drawing
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ctx.beginPath();
                ctx.moveTo(x, y);
                setIsDrawing(true);
            }
        }
    };

    // Continue drawing
    const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ctx.lineTo(x, y);
                ctx.strokeStyle = 'red'; // Pen color
                ctx.lineWidth = 2; // Pen width
                ctx.stroke();
            }
        }
    };

    // Stop drawing
    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            setHistory((prevHistory) => [...prevHistory, url]); // Save current state
        }
    };

    // Clear canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        setHistory([]); // Reset history
    };

    // Undo the last action
    const undoLastAction = () => {
        if (history.length > 0) {
            const canvas = canvasRef.current;
            const lastState = history[history.length - 2]; // Get the second last state
            setHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove last state
            if (canvas && lastState) {
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = lastState;
                img.onload = () => {
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0); // Restore the last state
                    }
                };
            }
        }
    };

    // Save the edited image
    const saveEditedImage = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (canvas && image) {
            const mergedCanvas = document.createElement('canvas');
            const ctx = mergedCanvas.getContext('2d');
            mergedCanvas.width = image.width;
            mergedCanvas.height = image.height;

            if (ctx) {
                ctx.drawImage(image, 0, 0); // Draw the original image
                ctx.drawImage(canvas, 0, 0); // Overlay the canvas edits
                const finalImage = mergedCanvas.toDataURL('image/png');
                setEditedScreenshot(finalImage)
            }
        }
        setIsModalVisible(false);
    };
    return (
        <div className='ticket-riser'>
            {/* Floating button to open/close the ticket box */}
            <Tooltip title="Raise Ticket">
                <Button
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        padding: '0',
                        boxShadow: 'none',
                    }}
                    onClick={toggleTicketBox}
                >
                    <img
                        src={helpDeskLog}
                        alt="Ticket Icon"
                        style={{
                            width: '64px',
                            height: '54px',
                            background: 'transparent',
                        }}
                    />
                </Button>
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
                                    <Radio.Group>
                                        <Radio.Button value="3">CR</Radio.Button>
                                        <Radio.Button value="2">Bug</Radio.Button>
                                    </Radio.Group>
                                </Form.Item></Col>
                                <Col>
                                    <div style={{ display: 'flex', marginTop: '15px' }}>
                                        <Form.Item name="isImageNeeded" valuePropName="checked" label='Include Attachment' noStyle>
                                            <Checkbox />
                                        </Form.Item>
                                        &nbsp;&nbsp;&nbsp;<label htmlFor="">Include Attachment</label>
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
                onCancel={handleCancel}
                width={800}
                styles={{ body: { maxHeight: '500px', overflow: 'auto' } }}
                footer={null}
                // footer={[
                //     <Button key="undo" onClick={undoLastAction} disabled={history.length === 0}>
                //         Undo
                //     </Button>,
                //     <Button key="clear" danger onClick={clearCanvas}>
                //         Clear
                //     </Button>,
                //     <Button key="save" type="primary" onClick={saveEditedImage}>
                //         Save Changes
                //     </Button>,
                // ]}
            >
                {/* <img
                    src={ticketDetails.screenshot || ''}
                    alt="Screenshot"
                    style={{ maxWidth: '100%', maxHeight: '500px' }}
                /> */}
                <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                    <img
                        ref={imageRef}
                        src={ticketDetails.screenshot || ''}
                        alt="Screenshot"
                        style={{ width: '100%', display: 'block' }}
                    />
                    {/* <canvas
                        ref={canvasRef}
                        width={500}
                        height={500}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'crosshair',
                        }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    /> */}
                </div>
            </Modal>
        </div>
    );
};

export default TicketRaiser;