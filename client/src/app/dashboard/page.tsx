import { Container, Card, CardHeader, CardContent, Typography } from '@mui/material';

type Order = {
  id: string;
  status: string;
  createdAt: string;
  cost: number;
  address: string;
  deliveryStartedAt?: string;
  phoneNumber: string;
};

async function getOrders(): Promise<{ data: { orders: Order[] } }> {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
          query Orders {
            orders {
              id
              status
              createdAt
              cost
              address
              deliveryStartedAt
              phoneNumber
            }
          }
        `,
    }),
  });
  return response.json();
}

const Dashboard = async () => {
  const { data } = await getOrders();
  return (
    <Container sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {data.orders.map(order => (
          <Card variant='outlined' sx={{ m: 2, maxWidth: 250 }} key={order.id}>
            <CardHeader title={`Order ${order.id}`} />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Status: {order.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Created at: {order.createdAt}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Cost: {order.cost}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {order.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Delivery started at: {order.deliveryStartedAt}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phone number: {order.phoneNumber}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </Container>
  );
};

export default Dashboard;
