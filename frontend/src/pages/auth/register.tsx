import { Button, Form, Input, Select, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';

const { Option } = Select;

type AccountType = 'CANDIDATE' | 'COMPANY' | null;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit]       = useState(false);
    const [accountType, setAccountType] = useState<AccountType>(null);

    const onFinish = async (values: any) => {
        const { name, email, password, age, gender, address } = values;

        setIsSubmit(true);
        // FE chỉ gửi userType — BE tự tra DB tìm role đúng và gán
        const res = await callRegister(name, email, password, +age, gender, address, accountType ?? 'CANDIDATE');
        setIsSubmit(false);

        if (res?.data?.id) {
            notification.success({
                message: 'Đăng ký thành công!',
                description: 'Tài khoản đã được tạo. Hãy đăng nhập để bắt đầu.',
            });
            navigate('/login');
        } else {
            notification.error({
                message: 'Đăng ký thất bại',
                description: Array.isArray(res.message) ? res.message[0] : res.message,
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
                        {accountType === 'COMPANY'
                            ? <>Tìm kiếm<br /><em>nhân tài IT</em> hàng đầu</>
                            : <>Bắt đầu hành trình<br />sự nghiệp <em>IT</em> của bạn</>}
                    </h1>
                    <p className={styles['auth-desc']}>
                        {accountType === 'COMPANY'
                            ? 'Đăng tin tuyển dụng, tiếp cận hàng ngàn developer chất lượng cao tại Việt Nam.'
                            : 'Tạo tài khoản miễn phí và kết nối với hàng trăm nhà tuyển dụng công nghệ hàng đầu.'}
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

                    {!accountType ? (
                        <>
                            <h2 className={styles['auth-card-title']}>Tạo tài khoản ✨</h2>
                            <p className={styles['auth-card-sub']}>Bạn muốn tham gia với tư cách nào?</p>
                            <div className={styles['role-picker']}>
                                <button className={styles['role-card']} onClick={() => setAccountType('CANDIDATE')}>
                                    <div className={styles['role-card-icon']}>👨‍💻</div>
                                    <div className={styles['role-card-title']}>Ứng viên</div>
                                    <div className={styles['role-card-desc']}>Tìm việc làm IT, nộp CV và theo dõi trạng thái ứng tuyển</div>
                                    <div className={styles['role-card-cta']}>Tạo tài khoản Ứng viên →</div>
                                </button>
                                <button className={`${styles['role-card']} ${styles['role-card-company']}`} onClick={() => setAccountType('COMPANY')}>
                                    <div className={styles['role-card-icon']}>🏢</div>
                                    <div className={styles['role-card-title']}>Nhà tuyển dụng</div>
                                    <div className={styles['role-card-desc']}>Đăng tin tuyển dụng, quản lý hồ sơ và tìm kiếm nhân tài</div>
                                    <div className={styles['role-card-cta']}>Tạo tài khoản Công ty →</div>
                                </button>
                            </div>
                            <p className={styles['auth-footer-text']} style={{ marginTop: 24 }}>
                                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={styles['reg-header']}>
                                <button className={styles['reg-back']} onClick={() => setAccountType(null)}>← Quay lại</button>
                                <span className={`${styles['reg-badge']} ${accountType === 'COMPANY' ? styles['reg-badge-company'] : ''}`}>
                                    {accountType === 'COMPANY' ? '🏢 Nhà tuyển dụng' : '👨‍💻 Ứng viên'}
                                </span>
                            </div>
                            <h2 className={styles['auth-card-title']} style={{ marginTop: 12 }}>
                                {accountType === 'COMPANY' ? 'Đăng ký Công ty' : 'Đăng ký Ứng viên'}
                            </h2>
                            <p className={styles['auth-card-sub']}>Đã có tài khoản?{' '}<Link to="/login">Đăng nhập ngay</Link></p>

                            <Form name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
                                <Form.Item className={styles['form-item']}
                                    label={accountType === 'COMPANY' ? 'Tên công ty' : 'Họ và tên'}
                                    name="name"
                                    rules={[{ required: true, message: `Vui lòng nhập ${accountType === 'COMPANY' ? 'tên công ty' : 'họ tên'}!` }]}
                                >
                                    <Input placeholder={accountType === 'COMPANY' ? 'Công ty ABC' : 'Nguyễn Văn A'} />
                                </Form.Item>
                                <Form.Item className={styles['form-item']} label="Email" name="email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                                >
                                    <Input placeholder={accountType === 'COMPANY' ? 'hr@congty.com' : 'developer@gmail.com'} />
                                </Form.Item>
                                <Form.Item className={styles['form-item']} label="Mật khẩu" name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Tối thiểu 6 ký tự!' }]}
                                >
                                    <Input.Password placeholder="Tối thiểu 6 ký tự" />
                                </Form.Item>
                                <div className={styles['form-row']}>
                                    <Form.Item className={styles['form-item']} label="Tuổi" name="age"
                                        rules={[{ required: true, message: 'Nhập tuổi!' }]}
                                    >
                                        <Input type="number" placeholder="25" min={16} max={99} />
                                    </Form.Item>
                                    <Form.Item className={styles['form-item']} label="Giới tính" name="gender"
                                        rules={[{ required: true, message: 'Chọn giới tính!' }]}
                                    >
                                        <Select placeholder="Chọn">
                                            <Option value="MALE">Nam</Option>
                                            <Option value="FEMALE">Nữ</Option>
                                            <Option value="OTHER">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <Form.Item className={styles['form-item']}
                                    label={accountType === 'COMPANY' ? 'Địa chỉ công ty' : 'Địa chỉ'}
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                >
                                    <Input placeholder="TP. Hồ Chí Minh, Việt Nam" />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button type="primary" htmlType="submit" loading={isSubmit} className={styles['submit-btn']}>
                                        {isSubmit ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                                    </Button>
                                </Form.Item>
                            </Form>
                            <p className={styles['auth-footer-text']} style={{ marginTop: 20 }}>
                                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
