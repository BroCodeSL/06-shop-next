import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';

import { AdminLayout } from '@/components';
import { IUser } from '@/interfaces';
import { shopApi } from '@/api';

const UsersPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if ( data) {
      setUsers(data);
    }
  }, [data])
  

  if ( !data && !error) return (<></>);

  const onRoleUpdated = async ( userId: string, newRole: string ) => {

    const previousUsers = users.map( user => ({...user} ));
    const updatedUsers = users.map( user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }));

    setUsers(updatedUsers);

    try {
      await shopApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      console.log(error);
      setUsers(previousUsers);
      alert('Cannot update user role');
    }

  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Name', width: 300 },
    {
      field: 'role',
      headerName: 'Role',
      width: 300,
      renderCell: ({row}: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label=""
            onChange={({ target }) => onRoleUpdated( row.id, target.value )}
            sx={{ width: '300px' }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">Super user</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        )
      }
    },
  ]

  const rows = users!.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
    <AdminLayout
      title='Users'
      subTitle='User maintenance'
      icon={ <PeopleOutline /> }
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

export default UsersPage