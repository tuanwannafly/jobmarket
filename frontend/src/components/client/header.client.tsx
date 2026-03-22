import { useState, useEffect } from 'react';
import {
    CodeOutlined,
    ContactsOutlined,
    FireOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message, Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';
 
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
 
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
 
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [current, setCurrent] = useState('/');
    const [openManageAccount, setOpenManageAccount] = useState(false);
 
    const location = useLocation();
 
    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);
 
    const items: MenuProps['items'] = [
        {
            label: <Link to="/">Trang Chủ</Link>,
            key: '/',
        },
        {
            label: <Link to="/job">Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to="/company">Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        },
    ];
 
    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };
 
    const itemsDropdown = [
        {
            label: <span onClick={() => setOpenManageAccount(true)}>Quản lý tài khoản</span>,
            key: 'manage-account',
            icon: <ContactsOutlined />,
        },
        // Fix Bug 4: check role name thay vì permissions.length
        // SUPER_ADMIN có thể không có permissions array nhưng vẫn phải vào được admin
        ...(user.role?.name === 'SUPER_ADMIN' ? [{
            label: <Link to="/admin">Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />,
        }] : []),
        {
            label: <span onClick={handleLogout}>Đăng xuất</span>,
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];
 
    return (
        <>
            <div className={styles['header-section']}>
                <div className={styles['header-inner']}>
                    {!isMobile ? (
                        <>
                            {/* LOGO */}
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <div className={styles['brand-icon']}>⚡</div>
                                <span className={styles['brand-name']}>
                                    Job<span>IT</span>
                                </span>
                            </div>
 
                            {/* MENU */}
                            <div className={styles['menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#2563EB',
                                            colorBgContainer: 'transparent',
                                            colorText: '#94a3b8',
                                            colorTextLightSolid: '#ffffff',
                                            fontSize: 14,
                                        },
                                        components: {
                                            Menu: {
                                                itemSelectedColor: '#ffffff',
                                                itemHoverColor: '#ffffff',
                                                itemColor: '#94a3b8',
                                                itemBg: 'transparent',
                                                itemSelectedBg: 'transparent',
                                                itemHoverBg: 'transparent',
                                                horizontalItemSelectedColor: '#ffffff',
                                                activeBarBorderWidth: 0,
                                                activeBarColor: 'transparent',
                                                horizontalItemSelectedBg: 'transparent',
                                            }
                                        }
                                    }}
                                >
                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: 'none',
                                        }}
                                        overflowedIndicator={null}
                                    />
                                </ConfigProvider>
                            </div>
 
                            {/* RIGHT */}
                            <div className={styles['right']}>
                                {!isAuthenticated ? (
                                    <Link to="/login">Đăng Nhập</Link>
                                ) : (
                                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                        <Space style={{ cursor: 'pointer' }}>
                                            <span style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 500 }}>
                                                Hi, {user?.name}
                                            </span>
                                            <Avatar
                                                style={{
                                                    background: 'linear-gradient(135deg,#2563EB,#0EA5E9)',
                                                    fontWeight: 700,
                                                    fontSize: 13,
                                                }}
                                            >
                                                {user?.name?.substring(0, 2)?.toUpperCase()}
                                            </Avatar>
                                        </Space>
                                    </Dropdown>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={styles['header-mobile']}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    background: 'linear-gradient(135deg,#2563EB,#0EA5E9)',
                                    borderRadius: 8, padding: '3px 8px',
                                    fontSize: 14, fontWeight: 800,
                                }}>⚡</span>
                                <span>JobIT</span>
                            </div>
                            <MenuFoldOutlined
                                style={{ fontSize: 22 }}
                                onClick={() => setOpenMobileMenu(true)}
                            />
                        </div>
                    )}
                </div>
            </div>
 
            {/* MOBILE DRAWER */}
            <Drawer
                title={
                    <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800 }}>
                        ⚡ JobIT
                    </span>
                }
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
                width={260}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[current]}
                    items={[...items, ...(isAuthenticated ? itemsDropdown : [])]}
                    style={{ border: 'none' }}
                />
            </Drawer>
 
            <ManageAccount
                open={openManageAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};
 
export default Header;