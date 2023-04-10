import { useContext, useState } from 'react';
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
  AppRegistrationOutlined,
  DashboardOutlined
} from "@mui/icons-material";

import { AuthContext, UIContext } from '@/context';

export const Sidebar = () => {
  const router = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext(UIContext)
  const { user, isLoggedIn, logout } = useContext(AuthContext)
  
  const [searchTerm, setSearchTerm] = useState("");  

  const onSearchTerm = () => {
    if(!searchTerm.trim().length ) return;

    navigateTo(`/search/${searchTerm}`)
  }

  const navigateTo = (url: string) => {
    toggleSideMenu();
    router.push(url);
  }

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      onClose={ toggleSideMenu }
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" ? onSearchTerm() : null}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {
            isLoggedIn && (
              <>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Perfil"} />
                </ListItemButton>

                <ListItemButton
                  // button
                  onClick={() => navigateTo('/orders/history')}
                >
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Mis Ordenes"} />
                </ListItemButton>
              </>
            )
          }

          <ListItemButton
            onClick={() => navigateTo('/category/men') }
            sx={{ display: { xs: "", sm: "none" } }}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Hombres"} />
          </ListItemButton>

          <ListItemButton
            onClick={() => navigateTo('/category/women') }
            sx={{ display: { xs: "", sm: "none" } }}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mujeres"} />
          </ListItemButton>

          <ListItemButton
            onClick={() => navigateTo('/category/kids') }
            sx={{ display: { xs: "", sm: "none" } }}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Niños"} />
          </ListItemButton>

          {
            isLoggedIn
              ? (
                <ListItemButton onClick={logout}>
                  <ListItemIcon>
                    <LoginOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              )
              : (
                <>
                  <ListItemButton
                    onClick={() => navigateTo(`/auth/login?p=${ router.asPath }`)}
                  >
                    <ListItemIcon>
                      <VpnKeyOutlined />
                    </ListItemIcon>
                    <ListItemText primary={"Login"} />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => navigateTo(`/auth/register?p=${ router.asPath }`)}
                  >
                    <ListItemIcon>
                      <AppRegistrationOutlined />
                    </ListItemIcon>
                    <ListItemText primary={"Register"} />
                  </ListItemButton>
                </>
              )
          }

          {/* Admin */}
          {
            user?.role === 'admin' && (
              <>
                <Divider />
                <ListSubheader>Admin Panel</ListSubheader>

                <ListItemButton
                  onClick={() => navigateTo("/admin/")}
                >
                  <ListItemIcon>
                    <DashboardOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>

                <ListItemButton>
                  <ListItemIcon>
                    <CategoryOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Productos"} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigateTo("/admin/orders")}
                >
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Ordenes"} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigateTo("/admin/users")}
                >
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText primary={"Usuarios"} />
                </ListItemButton>
              </>
            )
          }
          
        </List>
      </Box>
    </Drawer>
  );
};
