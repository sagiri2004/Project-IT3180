import React, { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Payment as PaymentIcon,
    VolunteerActivism as DonationIcon,
    History as HistoryIcon,
    Logout as LogoutIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Dashboard as DashboardIcon,
    AttachMoney as MoneyIcon,
    Campaign as CampaignIcon,
    DirectionsCar as CarIcon,
    LocalParking as ParkingIcon,
    LocalAtm as UtilityIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

const APP_NAME = 'CiviDesk';
const MIN_WIDTH = 60;
const NORMAL_WIDTH = 240;
const LARGE_WIDTH = 320;

const LogoSVG = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="8" width="28" height="20" rx="5" fill="#1976d2"/>
        <rect x="7" y="13" width="18" height="10" rx="2" fill="#63a4ff"/>
        <circle cx="16" cy="18" r="3" fill="#fff"/>
        <rect x="12" y="4" width="8" height="6" rx="2" fill="#1976d2"/>
    </svg>
);

const Layout: React.FC<{ toggleTheme?: () => void; mode?: 'light' | 'dark' }> = ({ toggleTheme, mode }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [sidebarWidth, setSidebarWidth] = useState(NORMAL_WIDTH);
    const [sidebarMode, setSidebarMode] = useState<'mini' | 'normal' | 'large'>('normal');
    const resizing = useRef(false);

    const handleDrawerToggle = () => {
        setSidebarMode((prev) => prev === 'mini' ? 'normal' : 'mini');
        setSidebarWidth(prev => prev === MIN_WIDTH ? NORMAL_WIDTH : MIN_WIDTH);
    };

    const handleSidebarResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        resizing.current = true;
        const startX = e.clientX;
        const startWidth = sidebarWidth;
        const onMouseMove = (moveEvent: MouseEvent) => {
            let newWidth = startWidth + (moveEvent.clientX - startX);
            if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
            if (newWidth > LARGE_WIDTH) newWidth = LARGE_WIDTH;
            setSidebarWidth(newWidth);
            setSidebarMode(newWidth < 100 ? 'mini' : newWidth > 260 ? 'large' : 'normal');
        };
        const onMouseUp = () => {
            resizing.current = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { text: 'Tổng quan', icon: DashboardIcon, path: '/dashboard' },
        { text: 'Hộ gia đình', icon: HomeIcon, path: '/households' },
        { text: 'Cư dân', icon: PeopleIcon, path: '/residents' },
        { text: 'Thay đổi nhân khẩu', icon: HistoryIcon, path: '/population-changes' },
        { text: 'Đóng góp', icon: MoneyIcon, path: '/donations' },
        { text: 'Chiến dịch', icon: CampaignIcon, path: '/donation-campaigns' },
        { text: 'Thu phí', icon: PaymentIcon, path: '/fees' },
        { text: 'Phương tiện', icon: CarIcon, path: '/vehicles' },
        { text: 'Phí gửi xe', icon: ParkingIcon, path: '/vehicle-fees' },
        { text: 'Hóa đơn tiện ích', icon: UtilityIcon, path: '/utility-bills' },
        { text: 'Người dùng', icon: PeopleIcon, path: '/users' },
        { text: 'Lịch sử', icon: HistoryIcon, path: '/history' }
    ];

    // Custom scrollbar CSS
    const scrollbarStyle = `
        ::-webkit-scrollbar {
            width: 8px;
            background: ${theme.palette.mode === 'dark' ? '#232526' : '#e3f0ff'};
        }
        ::-webkit-scrollbar-thumb {
            background: ${theme.palette.mode === 'dark' ? '#414345' : '#b3c6e6'};
            border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: ${theme.palette.mode === 'dark' ? '#555' : '#90caf9'};
        }
    `;

    const isActive = (item: { path: string; text: string }) => {
        if (item.text === 'Trang chủ') {
            return location.pathname === '/';
        }
        if (item.text === 'Quản lý hộ khẩu') {
            return location.pathname.startsWith('/households') && location.pathname !== '/households';
        }
        return location.pathname.startsWith(item.path);
    };

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #232526 0%, #414345 100%)'
                    : 'linear-gradient(180deg, #e3f0ff 0%, #fafcff 100%)',
                color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                borderRight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: 'width 0.2s',
                width: '100%'
            }}
        >
            <style>{scrollbarStyle}</style>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: sidebarMode === 'mini' ? 'center' : 'flex-start', px: 1 }}>
                <LogoSVG />
                {sidebarMode !== 'mini' && (
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 900,
                            letterSpacing: 1,
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: 22
                        }}
                    >
                        {APP_NAME}
                    </Typography>
                )}
                <IconButton
                    size="small"
                    onClick={handleDrawerToggle}
                    sx={{ ml: 'auto', display: { xs: 'none', sm: 'inline-flex' } }}
                >
                    {sidebarMode === 'mini' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </Toolbar>
            <List>
                {menuItems.map((item) => {
                    const active = isActive(item);
                    const IconComponent = item.icon;
                    return (
                        <ListItem
                            component="div"
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                                minHeight: 44,
                                px: sidebarMode === 'mini' ? 1 : 2,
                                justifyContent: sidebarMode === 'mini' ? 'center' : 'flex-start',
                                fontWeight: active ? 700 : 400,
                                color: active ? theme.palette.primary.main : 'inherit',
                                background: active ? (theme.palette.mode === 'dark' ? 'rgba(99,164,255,0.12)' : 'rgba(25,118,210,0.08)') : 'none',
                                '&:hover': {
                                    background: theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.08)'
                                        : 'rgba(25, 118, 210, 0.08)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: active ? theme.palette.primary.main : 'inherit', minWidth: 0, mr: sidebarMode === 'mini' ? 0 : 2, justifyContent: 'center' }}>
                                <IconComponent />
                            </ListItemIcon>
                            {sidebarMode !== 'mini' && <ListItemText primary={item.text} sx={{ fontWeight: active ? 700 : 400 }} />}
                        </ListItem>
                    );
                })}
                <ListItem
                    component="div"
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        minHeight: 44,
                        px: sidebarMode === 'mini' ? 1 : 2,
                        justifyContent: sidebarMode === 'mini' ? 'center' : 'flex-start',
                        '&:hover': {
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.08)'
                                : 'rgba(25, 118, 210, 0.08)',
                            cursor: 'pointer'
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: sidebarMode === 'mini' ? 0 : 2, justifyContent: 'center' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    {sidebarMode !== 'mini' && <ListItemText primary="Đăng xuất" />}
                </ListItem>
            </List>
            {/* Thanh kéo resize */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 8,
                    height: '100vh',
                    cursor: 'col-resize',
                    zIndex: 1300
                }}
                onMouseDown={handleSidebarResize}
            />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${sidebarWidth}px)` },
                    ml: { sm: `${sidebarWidth}px` },
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
                        : 'linear-gradient(90deg, #1976d2 0%, #63a4ff 100%)',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                    borderRadius: 0
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 900,
                            letterSpacing: 1,
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: 24
                        }}
                    >
                        {APP_NAME}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 400,
                            fontSize: 18,
                            mr: 2,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        Smart Community Management
                    </Typography>
                    {toggleTheme && (
                        <Tooltip title={mode === 'dark' ? 'Chuyển sang Light mode' : 'Chuyển sang Dark mode'}>
                            <IconButton color="inherit" onClick={toggleTheme}>
                                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: sidebarWidth },
                    flexShrink: { sm: 0 },
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    height: '100vh',
                    zIndex: 1200,
                    boxShadow: 3,
                    overflow: 'hidden'
                }}
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: sidebarWidth,
                            minWidth: MIN_WIDTH,
                            maxWidth: LARGE_WIDTH,
                            overflowY: 'hidden',
                            overflowX: 'hidden',
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(180deg, #232526 0%, #414345 100%)'
                                : 'linear-gradient(180deg, #e3f0ff 0%, #fafcff 100%)',
                            color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                            borderRight: 0,
                            transition: 'width 0.2s',
                            position: 'relative',
                            zIndex: 1200,
                            height: '100vh'
                        }
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 2 },
                    width: { sm: `calc(100% - ${sidebarWidth}px)` },
                    minHeight: '100vh',
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
                        : 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)',
                    borderRadius: 0,
                    boxShadow: 'none',
                    transition: 'background 0.3s',
                    ml: { sm: `${sidebarWidth}px` }
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout; 