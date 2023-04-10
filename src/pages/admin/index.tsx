import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';

import { AdminLayout, SummaryTile } from '@/components';
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage: NextPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30s
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {

    const interval = setInterval(() => {
      console.log('Tick');
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
    }, 1000)
  
    return () => clearInterval(interval);
  }, [])
  

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error loading information</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    outOfStockProducts,
    lowInventoryProducts,
    notPaidOrders
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='General Statistics'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle="Total orders"
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={paidOrders}
          subTitle="Paid orders"
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subTitle="Pending orders"
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subTitle="Clients"
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subTitle="Products"
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={outOfStockProducts}
          subTitle="Out of Stock"
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={lowInventoryProducts}
          subTitle="Low inventory"
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={refreshIn}
          subTitle="Update on"
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage;