import React, { useState, useEffect, useCallback } from 'react';
import "antd/dist/antd.css";
import {Card, Typography, Layout, Row, Col, Space, Button, Select, message} from 'antd';
import {CreateModal} from './modules/CreateModal'
import {UpdateModal} from './modules/UpdateModal'
import moment from 'moment'
import debounce from 'lodash.debounce';

const {Title} = Typography
const {Content} = Layout
const {Option} = Select;

function App() {
  const [meetings, setMeetings] = useState([])
  const [filteredMeetings, setfilteredMeetings] = useState([])
  const [filter, setFilter] = useState('All')
  const [createvisible, setcreatevisible] = useState(false)
  const [updatevisible, setupdatevisible] = useState(false)
  const [updateindex, setupdateindex] = useState(-1)
  useEffect(()=>{
    debouncedChangeHandler()
  })
  useEffect(() => {
    getData()
  }, [createvisible,updatevisible])
  useEffect(() => {
    if(filter === "All"){
      setfilteredMeetings(meetings)
    }else{
      setfilteredMeetings(meetings.filter(item => item.status === filter))
    }
  }, [filter,meetings])

  const getData = () => {
    fetch('http://localhost:3001/meetings', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(result => {
      const format = result.map(item => {
        return {...item, date: moment(item.date)}
      })
      setMeetings(format)
     
    })
  }
  const updateMeeting = (id,data) =>{
    fetch('http://localhost:3001/meetings/' + id, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      message.success('Successfully updated');
    }).catch(e => {
      message.error(JSON.stringify(e));
      console.log(e)
    })
    setupdateindex(-1)
    setupdatevisible(false)
  }
  const createMeeting = (data) =>{
    fetch('http://localhost:3001/meetings', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      message.success('Successfully added');
    }).catch(e => {
      message.error(JSON.stringify(e));
      console.log(e)
    })
    setcreatevisible(false)
  }
  const deleteitem = (id) => {
    fetch('http://localhost:3001/meetings/' + id, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => {
      message.success('Successfully deleted');
    }).catch(e => {
      message.error(JSON.stringify(e));
      console.log(e)
    })
    setupdateindex(-1)
    setupdatevisible(false)
  }
  const changeFilter = (value) => {
    setFilter(value)
  } 
  const debouncedChangeHandler = useCallback(
    debounce(getData, 1000)
  , []);
  return (
    <Content>
      <Row>
        <Col xs={{span: 24, offset: 0}} md={{span: 12, offset: 6}}>
          <Card>
            <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
              <Title level={1}>
                Calendar App
              </Title>
            </Space>
            <Space direction="horizontal" style={{width: '100%', justifyContent: 'right'}}>
              <Select defaultValue="All" style={{ width: 120 }} onChange={changeFilter}>
                <Option value="All">All</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Done">Done</Option>
                <Option value="Delayed">Delayed</Option>
              </Select>
            </Space>
            <Card bordered={false} style={{paddingTop: 10}}>
              {filteredMeetings.map((item) => {
                  return(
                  <Card.Grid key={item.desc} onClick={() => {setupdatevisible(true);setupdateindex(item.id)}} hoverable={true} style={{width: '100%', marginTop: 10}}>
                    <Row justify="space-between">
                      <Col>
                      {item.desc}
                      </Col>
                      <Col>
                      {item.date.format('dddd')}
                      </Col>
                    </Row>
                    <Row justify="space-between">
                      <Col>
                      {item.status}
                      </Col>
                      <Col>
                      {item.date.format('MMM DD, YYYY')}
                      </Col>
                    </Row> 
                  </Card.Grid>
                  )
                })}
            </Card>
            {
              updateindex !== -1 ? <UpdateModal visible={updatevisible} onOk={updateMeeting} onDelete={deleteitem} onCancel={() => setupdatevisible(false)} id={updateindex} data={meetings.find(item => item.id === updateindex)} /> : ''
            }
            <Space direction="horizontal" style={{width: '100%', justifyContent: 'right', paddingTop: 10}}>
              <Button onClick={() => setcreatevisible(true)}>Add</Button>
              <CreateModal visible={createvisible} onOk={createMeeting} onCancel={() => setcreatevisible(false)} />
            </Space>
          </Card>
        </Col>
      </Row>
    </Content>
  );
}
export default App;
