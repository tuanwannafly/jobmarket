import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className={styles.homeWrapper}>

            {/* ── HERO ─────────────────────────────────────────── */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>

                    <div className={styles.heroBadge}>
                        <span>🚀</span>
                        <span>Nền tảng tuyển dụng IT hàng đầu Việt Nam</span>
                    </div>

                    <h1>
                        Tìm <em>việc làm IT</em><br />
                        dành cho Developer
                    </h1>
                    <p>Hơn 1.000+ cơ hội từ các công ty công nghệ hàng đầu đang chờ bạn</p>

                    <div className={styles.searchWrapper}>
                        <SearchClient />
                    </div>

                    <div className={styles.heroStats}>
                        <div className={styles.heroStatItem}>
                            <strong>1,200+</strong>
                            <span>Việc làm mở</span>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStatItem}>
                            <strong>350+</strong>
                            <span>Công ty IT</span>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStatItem}>
                            <strong>50K+</strong>
                            <span>Developer tin dùng</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── COMPANY SECTION ──────────────────────────────── */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🏢 Nhà Tuyển Dụng Hàng Đầu</h2>
                    <Link to="/company" className={styles.sectionLink}>
                        Xem tất cả →
                    </Link>
                </div>
                <CompanyCard />
            </div>

            {/* ── JOB SECTION ──────────────────────────────────── */}
            <div className={styles.section} style={{ paddingTop: 0 }}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>💼 Việc Làm Mới Nhất</h2>
                    <Link to="/job" className={styles.sectionLink}>
                        Xem tất cả →
                    </Link>
                </div>
                <JobCard />
            </div>

        </div>
    );
};

export default HomePage;
