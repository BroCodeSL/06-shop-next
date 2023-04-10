import { NextPage, GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ShopLayout } from '@/components';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Full Name', width: 300 },

  {
    field: 'paid',
    headerName: 'Paid',
    description: 'Shows if the order is off or not',
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return (
        params.row.paid
          ? <Chip color='success' label="Paid" variant='outlined' />
          : <Chip color='error' label="Not paid" variant='outlined' />
      )
    }
  },

  {
    field: 'order',
    headerName: 'See order',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Link
          href={`/orders/${params.row.orderId}`}
          component={NextLink}
          color="text.primary"
          underline='always'
        >
          See order
        </Link>
      )
    }
  },
];

interface Props {
  orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

  const rows = orders.map( (o, index) => ({
    id: index + 1,
    paid: o.isPaid,
    fullname: `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`,
    orderId: o._id
  }))

  return (
    <ShopLayout title='Order history' pageDescription='Customer order history'>
      <Typography variant='h1' component='h1'>Order history</Typography>

      <Grid container sx={{ pt: 2 }} className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width:'100%' }}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={[10]}

          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false
      }
    }
  }

  const orders = await dbOrders.getOrderByUser( session.user._id );

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage