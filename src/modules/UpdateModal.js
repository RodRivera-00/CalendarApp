import React, { useState, useEffect} from 'react';
import {Modal, Input, DatePicker, Select, Button, Space, Typography} from 'antd';
import moment from 'moment'
const {Option} = Select;
const {Text} = Typography
export function UpdateModal({visible,onOk,onCancel,onDelete,id,data}){
    const [formData, setformData] = useState({
      desc: '',
      date: null,
      status: ''
    })
    const [error, setError] = useState({
      desc: true,
      date: true,
      status: true
    })
  
    useEffect(()=>{
      if(id !== -1){
        setformData(data)
      }
    },[id])
    const validate = () => {
      setError({  
        desc: formData.desc !== '',
        date: formData.date !== null,
        status: formData.status !== ''
      })
      if(formData.desc !== '' && formData.date !== null && formData.status !== ''){
        onOk(id,formData)
        setformData({
          desc: "",
          date: null,
          status: "Pending"
        })
      }
    }
    return (
      <Modal
            visible={visible}
            title="Update Meeting"
            onCancel={onCancel}
            width={350}
            footer={[
              <Button key="Cancel" onClick={onCancel}>
                Cancel
              </Button>,
              <Button type="danger" key="Delete" onClick={() => onDelete(id)}>
                Delete
              </Button>,
              <Button key="Create" type="primary" onClick={validate}>
                Update
              </Button>
            ]}
          >
            <Space direction='vertical' style={{width: '100%'}}>
              <Text>
                Meeting Description <Text type="danger" hidden={error.desc}>Description is required</Text>
              </Text>
              <Input value={formData.desc} onChange={(e) => {setformData({...formData, desc: e.target.value});setError({...error, desc: e.target.value !== ''}) }}>
              </Input>
              <Text>
                Date <Text type="danger" hidden={error.date}>Date is required</Text>
              </Text>
              <DatePicker value={moment(formData.date)} style={{width: '100%'}} value={formData.date} onChange={(value) => {setformData({...formData, date: value});setError({...error, date: value !== null}) }}/>
              <Text>
                Status <Text type="danger" hidden={error.status}>Status is required</Text>
              </Text>
              <Select value={formData.status} style={{ width: '100%' }} onChange={(value) => {setformData({...formData, status: value});setError({...error, status: value.length !== 0}) }}>
                  <Option key="Pending" value="Pending">Pending</Option>
                  <Option key="Delayed" value="Delayed">Delayed</Option>
                  <Option key="Done" value="Done">Done</Option>
                </Select>
            </Space>
          </Modal>
    )
  }