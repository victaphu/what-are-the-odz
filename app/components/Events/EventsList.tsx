"use client"
import React, { useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import EventCard from '@/app/components/Events/EventCard';
import { useEvents } from '@/app/context/EventsContext';
import { Spin, Button, Typography, Space, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGroups } from '@/app/context/GroupsContext';


const EventsList: React.FC = () => {

  const { activeGroup } = useGroups();
  const { loadEvents, events, setShowCreateEventDlg, loading } = useEvents();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 1 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  useEffect(() => {
    loadEvents(activeGroup);
  }, [activeGroup])

  if (!events) {
    return <Card style={{ textAlign: 'center', padding: '20px' }}>
      <Space direction="vertical" size="large">
        <Typography.Title level={5} style={{ 'color': 'var(--active-title)' }}>No events found</Typography.Title>
        <PlusOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        <Typography.Text>Click the button below to add a new event</Typography.Text>
        <Button type="primary" icon={<PlusOutlined />} size="small">
          Add Event
        </Button>
      </Space>
    </Card>;
  }

  const activeEvents = events.filter(event => event.endDate > new Date());

  return (
    <div id="ce-feed-container-2" className="" style={{ width: '99%', display: 'grid', position: 'absolute', padding: '8px' }}>
      <div className="ce-feed-container-top" style={{ height: '71px' }}></div>
      {loading && (
        <div style={{ zIndex: '1', width: '100%', display: 'grid', backgroundColor: 'var(--app-bg-color)' }}>
          <Spin size="large" style={{ margin: '0 auto', marginTop: '20px' }} />
          <Typography.Text style={{ textAlign: 'center', marginTop: '10px', color: 'var(--active-title)' }}>Loading events...</Typography.Text>
        </div>
      )}
      {!loading && activeEvents.length === 0 && (
        <Space direction="vertical" size="small" style={{ zIndex: '1', margin: '0 auto', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--app-bg-color)', width: '100%', paddingBottom: '20px' }}>
          <Typography.Title level={5} style={{ 'color': 'var(--active-title)' }}>No events found</Typography.Title>
          <Button type="primary" onClick={() => setShowCreateEventDlg(true)} size="small">
            Add Event
          </Button>
        </Space>
      )}
      {!loading && activeEvents.length > 0 && (<div style={{ zIndex: '1', width: '99%', display: 'grid', backgroundColor: 'var(--app-bg-color)' }}>
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container-with-dots"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024
              },
              items: 3,
              partialVisibilityGutter: 40
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0
              },
              items: 1,
              partialVisibilityGutter: 30
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464
              },
              items: 2,
              partialVisibilityGutter: 30
            }
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {activeEvents.map((event) => (
            <div key={event.id} style={{ width: "100%" }}>
              <EventCard event={event} />
            </div>
          ))}
        </Carousel>
      </div>)}
    </div>

  );
};

export default EventsList;
