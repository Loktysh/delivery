const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const ORDER_CREATED = 'ORDER_CREATED';
const ORDER_UPDATED = 'ORDER_UPDATED';

// In-memory data store for orders (replace with database interaction later)
let orders = [];
setTimeout(() => {
  const newOrders = Array.from({ length: 20 }, (_, index) => ({
    id: String(orders.length + index + 1),
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    deliveryStartedAt: 'not started',
    cost: (Math.random() * 100 + 0.1).toFixed(2),
    address: `${Math.floor(Math.random() * 1000)} ${['First', 'Second', 'Third'][Math.floor(Math.random() * 3)]} street, ${['Moscow', 'New York', 'Los Angeles', 'Chicago'][Math.floor(Math.random() * 3)]}`, 
    phoneNumber: `+7-${Math.floor(Math.random() * 1000000000)}`,
    status: ['pending', 'in_delivery', 'delivered'][Math.floor(Math.random() * 3)],
  }));
  orders.push(...newOrders);
  newOrders.forEach(order => pubsub.publish(ORDER_CREATED, { orderCreated: order }));
}, 0);
// For local tests
// setTimeout(() => {
//   const newOrder = {
//     id: String(orders.length + 1),
//     createdAt: new Date().toISOString(),
//     deliveryStartedAt: null,
//     cost: `${Math.random() * 100 + 0.1}`,
//     address: 'Faker adress',
//     phoneNumber: 'Fake phone number',
//     status: 'pending',
//   };
//   orders.push(newOrder);
//   pubsub.publish(ORDER_CREATED, { orderCreated: newOrder });
// }, 0);
// setTimeout(() => {
//   const newOrder = {
//     id: String(orders.length + 1),
//     createdAt: new Date().toISOString(),
//     deliveryStartedAt: null,
//     cost: `${Math.random() * 100 + 0.1}`,
//     address: 'Bbbbbdress',
//     phoneNumber: 'ttttttt',
//     status: 'started',
//   };
//   orders.push(newOrder);
//   pubsub.publish(ORDER_CREATED, { orderCreated: newOrder });
// }, 0);
const resolvers = {
  Query: {
    order: (parent, { id }) => orders.find(order => order.id === id),
    orders: () => orders,
  },
  Mutation: {
    createOrder: (parent, args) => {
      const newOrder = {
        id: String(orders.length + 1),
        createdAt: new Date().toISOString(),
        deliveryStartedAt: null,
        ...args,
      };
      orders.push(newOrder);
      pubsub.publish(ORDER_CREATED, { orderCreated: newOrder });
      return newOrder;
    },
    updateOrder: (parent, args) => {
      const orderIndex = orders.findIndex(order => order.id === args.id);
      if (orderIndex === -1) {
        return null;
      }
      const updatedOrder = { ...orders[orderIndex], ...args };
      orders[orderIndex] = updatedOrder;
      pubsub.publish(ORDER_UPDATED, { orderUpdated: updatedOrder });
      return updatedOrder;
    },
  },
  Subscription: {
    orderCreated: {
      subscribe: () => pubsub.asyncIterator([ORDER_CREATED]),
    },
    orderUpdated: {
      subscribe: () => pubsub.asyncIterator([ORDER_UPDATED]),
    },
  },
};

module.exports = resolvers;
