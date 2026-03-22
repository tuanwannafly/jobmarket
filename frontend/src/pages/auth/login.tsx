import { Button, Form, Input, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const callback = params?.get('callback');

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, []);

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user));

            const roleName = res.data.user?.role?.name;
            const isAdmin = roleName && roleName.trim() !== '' && roleName !== 'NORMAL_USER';

            // ✅ dùng navigate() — không reload trang, không mất Redux state
            if (callback) {
                navigate(callback);
            } else if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: res.message && Array.isArray(res.message)
                    ? res.message[0] : res.message,
                duration: 5,
            });
        }
    };

    return (
        <div className={styles['auth-page']}>
            <div className={styles['auth-left']}>
                <div className={styles['auth-left-inner']}>
                    <Link to="/" className={styles['auth-logo']}>
                        <div className={styles['logo-icon']}>⚡</div>
                        <span className={styles['logo-text']}>Job<span>IT</span></span>
                    </Link>
                    <h1 className={styles['auth-tagline']}>
                        Cơ hội nghề nghiệp<br />
                        dành cho <em>Developer</em>
                    </h1>
                    <p className={styles['auth-desc']}>
                        Hàng nghìn vị trí IT từ các công ty công nghệ hàng đầu
                        đang chờ đợi bạn. Đăng nhập để khám phá ngay hôm nay.
                    </p>
                    <div className={styles['auth-stats']}>
                        <div className={styles['auth-stat']}><strong>1,200+</strong><span>Việc làm</span></div>
                        <div className={styles['auth-stat']}><strong>350+</strong><span>Công ty IT</span></div>
                        <div className={styles['auth-stat']}><strong>50K+</strong><span>Developer</span></div>
                    </div>
                </div>
            </div>
            <div className={styles['auth-right']}>
                <div className={styles['auth-card']}>
                    <div className={styles['auth-mobile-logo']}>
                        <div className={styles['logo-icon']}>⚡</div>
                        <span className={styles['logo-text']}>Job<span>IT</span></span>
                    </div>
                    <h2 className={styles['auth-card-title']}>Chào mừng trở lại 👋</h2>
                    <p className={styles['auth-card-sub']}>
                        Chưa có tài khoản?{' '}
                        <Link to="/register">Đăng ký miễn phí</Link>
                    </p>
                    <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
                        <Form.Item
                            className={styles['form-item']}
                            label="Email" name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input placeholder="developer@gmail.com" />
                        </Form.Item>
                        <Form.Item
                            className={styles['form-item']}
                            label="Mật khẩu" name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" loading={isSubmit} className={styles['submit-btn']}>
                                {isSubmit ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className={styles['auth-footer-text']} style={{ marginTop: 24 }}>
                        Chưa có tài khoản?
                        <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
