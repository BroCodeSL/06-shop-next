import React from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Chip, Grid } from '@mui/material';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@/components';
import { IOrder, IUser } from '@/interfaces';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'total', headerName: 'Total', width: 100 },
  {
    field: 'isPaid',
    headerName: 'Paid',
    renderCell: ({row}: GridRenderCellParams) => {
      return row.isPaid
        ? (<Chip variant='outlined' label="Paid" color="success" />)
        : (<Chip variant='outlined' label="Not Paid" color="error" />)
    }
  },
  { field: 'numProducts', headerName: 'Num. Products', align:"center", width: 150 },
  {
    field: 'check',
    headerName: 'View order',
    renderCell: ({row}: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank">
          View order
        </a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Created At', width: 300 }
]

const OrdersPage: NextPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return (<></>);

  const rows = data!.map( order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    numProducts: order.numberOfItems,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout
      title={'Orders'}
      subTitle={'Order maintenance'}
      icon={<ConfirmationNumberOutlined />}
    >
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
    </AdminLayout>
  )
}

export default OrdersPage;