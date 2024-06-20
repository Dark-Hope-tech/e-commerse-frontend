import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackOrderById } from '../../services/orderService';
import NotFound from '../../components/NotFound/NotFound';
import classes from './orderTrackPage.module.css';
import DateTime from '../../components/DateTime/DateTime';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Title from '../../components/Title/Title';
import Map from '../../components/Map/Map';
import Button from '../../components/Button/Button';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const {user} = useAuth();

  useEffect(() => {
    orderId &&
      trackOrderById(orderId).then(order => {
        setOrder(order);
      });
  },[]);

  const handleCancelOrder = async () => {
    const response = await axios.post(`/api/orders/markCancelled`,{
      id:orderId
    });
    if (response.data.isSuccess) {
      const newOrder = order;
      newOrder.status = 'CANCELLED';
      setOrder(newOrder);
    }
  }
  const handleMarkPaidlOrder = async () => {
    const response = await axios.post(`/api/orders/markPaid`,{
      id:orderId
    });
    if (response.data.isSuccess) {
      const newOrder = order;
      newOrder.status = 'PAYED';
      setOrder(newOrder);
    }
  }

  const handleOrderDelete = async () => {
    const response = await axios.delete(`/api/orders/deleteOrder`, {
      data: {
        id: orderId
      }
    });
    console.log(response);
    if (response.data.success) {
      console.log("BOOM");
      setOrder(null);
      window.location.reload();
    }
  }
  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  return (
    order && (
      <div className={classes.container}>
        <div className={classes.content}>
          <h1>Order #{order.id}</h1>
          <div className={classes.header}>
            <div>
              <strong>Date</strong>
              <DateTime date={order.createdAt} />
            </div>
            <div>
              <strong>Name</strong>
              {order.name}
            </div>
            <div>
              <strong>Address</strong>
              {order.address}
            </div>
            <div>
              <strong>Phone Number</strong>
              {order.phoneNumber}
            </div>
            <div>
              <strong>State</strong>
              {order.status}
            </div>
            {order.paymentId && (
              <div>
                <strong>Payment ID</strong>
                {order.paymentId}
              </div>
            )}
          </div>

          <OrderItemsList order={order} />
        </div>

        <div>
          <Title title="Your Location" fontSize="1.6rem" />
          <Map location={order.addressLatLng} readonly={true} />
        </div>

        {
          order.status ==='NEW' && (
            <div className={classes.cancelled}>
              <Link to="/markCanceled">Cancel Order</Link>
            </div>
          )
        }
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {order.status === 'NEW' && (
            <div className={classes.payment} style={{ marginRight: 10 }}>
              <Button text="Cancel Order" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            </div>
          )}
          {order.status === 'NEW' && user.isAdmin && (
            <div className={classes.payment} style={{ marginRight: 10 }} >
              <Button text="Mark Paid" onClick={handleMarkPaidlOrder}>
                Mark Paid
              </Button>
            </div>
          )}
          {user.isAdmin && (
            <div className={classes.payment}>
              <Button text="Delete Order" onClick={handleOrderDelete}>
                Delete Order
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  );
}
