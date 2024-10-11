const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const ORDER_CREATED = 'ORDER_CREATED';
const ORDER_UPDATED = 'ORDER_UPDATED';

// In-memory data store for orders (replace with database interaction later)
let orders = [];

const resolvers = {
  Query: {
    order: (parent, { id }) => orders.find((order) => order.id === id),
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
      const orderIndex = orders.findIndex((order) => order.id === args.id);
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
