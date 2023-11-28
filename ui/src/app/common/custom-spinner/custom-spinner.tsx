import React from 'react';

import { Row, Spin } from 'antd'
import './custom-spinner.css';


/* eslint-disable-next-line */
export interface CustomSpinnerProps {
    loading: boolean;
}

export function CustomSpinner(
    props: CustomSpinnerProps
) {
    const { loading } = props;
    return (
        loading ? <div className='loader'>
            <Row justify='space-around' className='row'>
                <Spin size='large' />
            </Row>
        </div> : <></>
    );
}

export default CustomSpinner;
