import styles from '@/styles/client.module.scss';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles['footer-inner']}>
                <div className={styles['footer-top']}>

                    {/* BRAND COL */}
                    <div className={styles['footer-brand']}>
                        <div className={styles['footer-brand-name']}>
                            ⚡ Job<span>IT</span>
                        </div>
                        <p>
                            Kết nối hàng nghìn developer Việt Nam với những cơ hội việc làm
                            tốt nhất từ các công ty công nghệ hàng đầu.
                        </p>
                    </div>

                    {/* COL 2 */}
                    <div className={styles['footer-col']}>
                        <h4>Khám phá</h4>
                        <ul>
                            <li><Link to="/job">Việc làm IT</Link></li>
                            <li><Link to="/company">Công ty IT</Link></li>
                            <li><Link to="/">Trang chủ</Link></li>
                        </ul>
                    </div>

                    {/* COL 3 */}
                    <div className={styles['footer-col']}>
                        <h4>Tài khoản</h4>
                        <ul>
                            <li><Link to="/login">Đăng nhập</Link></li>
                            <li><Link to="/register">Đăng ký</Link></li>
                        </ul>
                    </div>

                    {/* COL 4 */}
                    <div className={styles['footer-col']}>
                        <h4>Liên hệ</h4>
                        <ul>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="mailto:hello@jobit.vn">hello@jobit.vn</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles['footer-bottom']}>
                    <span>© {new Date().getFullYear()} JobIT. All rights reserved.</span>
                    <span>Made with ❤️ in Vietnam</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
