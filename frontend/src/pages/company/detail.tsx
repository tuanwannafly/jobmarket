import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Skeleton } from "antd";
import {
    EnvironmentOutlined,
    ArrowLeftOutlined,
    CalendarOutlined,
    GlobalOutlined,
    TeamOutlined,
    ShareAltOutlined,
    HeartOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs';

const ClientCompanyDetailPage = () => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imgError, setImgError] = useState(false);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params?.get("id");

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true);
                const res = await callFetchCompanyById(id);
                if (res?.data) setCompanyDetail(res.data);
                setIsLoading(false);
            }
        };
        init();
    }, [id]);

    const logoSrc = companyDetail?.logo
        ? (companyDetail.logo.startsWith('http') ? companyDetail.logo : `${import.meta.env.VITE_BACKEND_URL}/storage/company/${companyDetail.logo}`)
        : null;

    const founded = companyDetail?.createdAt
        ? dayjs(companyDetail.createdAt).format('YYYY')
        : null;

    if (isLoading) {
        return (
            <div className={styles['cd-loading-wrap']}>
                <div className={styles['cd-loading-hero']} />
                <div className={styles['cd-loading-body']}>
                    <div style={{ flex: 1 }}>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </div>
                    <div style={{ width: 300 }}>
                        <Skeleton active paragraph={{ rows: 5 }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!companyDetail?.id) return null;

    return (
        <div className={styles['cd-page']}>

            {/* HERO */}
            <div className={styles['cd-hero']}>
                <div className={styles['cd-hero-mesh']} />
                <div className={styles['cd-hero-inner']}>
                    <button className={styles['cd-back']} onClick={() => navigate(-1)}>
                        <ArrowLeftOutlined />
                        <span>Quay lại</span>
                    </button>

                    <div className={styles['cd-hero-identity']}>
                        <div className={styles['cd-hero-logo']}>
                            {!imgError && logoSrc ? (
                                <img src={logoSrc} alt={companyDetail.name} onError={() => setImgError(true)} />
                            ) : (
                                <span className={styles['cd-logo-fallback']}>
                                    {companyDetail.name?.charAt(0)?.toUpperCase() ?? '?'}
                                </span>
                            )}
                        </div>

                        <div className={styles['cd-hero-meta']}>
                            <div className={styles['cd-hero-badge']}>🏢 Hồ sơ Công ty</div>
                            <h1 className={styles['cd-hero-name']}>{companyDetail.name}</h1>
                            <div className={styles['cd-hero-chips']}>
                                {companyDetail.address && (
                                    <span className={styles['cd-chip']}>
                                        <EnvironmentOutlined /> {companyDetail.address}
                                    </span>
                                )}
                                {founded && (
                                    <span className={styles['cd-chip']}>
                                        <CalendarOutlined /> Thành lập {founded}
                                    </span>
                                )}
                                <span className={styles['cd-chip-hot']}>🔥 Đang tuyển dụng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className={styles['cd-body']}>
                <div className={styles['cd-body-inner']}>

                    {/* LEFT */}
                    <div className={styles['cd-content']}>
                        <div className={styles['cd-card']}>
                            <div className={styles['cd-card-header']}>
                                <span className={styles['cd-card-accent']} />
                                <h2 className={styles['cd-card-title']}>Giới thiệu công ty</h2>
                            </div>
                            <div className={styles['cd-description']}>
                                {parse(companyDetail.description ?? '<p>Chưa có mô tả.</p>')}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className={styles['cd-sidebar']}>
                        <div className={styles['cd-sidebar-card']}>
                            <div className={styles['cd-sidebar-logo']}>
                                {!imgError && logoSrc ? (
                                    <img src={logoSrc} alt={companyDetail.name} onError={() => setImgError(true)} />
                                ) : (
                                    <span className={styles['cd-logo-fallback-lg']}>
                                        {companyDetail.name?.charAt(0)?.toUpperCase() ?? '?'}
                                    </span>
                                )}
                            </div>
                            <h3 className={styles['cd-sidebar-name']}>{companyDetail.name}</h3>
                            <span className={styles['cd-sidebar-badge']}>✓ Đã xác thực</span>

                            <div className={styles['cd-divider']} />

                            <div className={styles['cd-info-list']}>
                                {companyDetail.address && (
                                    <div className={styles['cd-info-row']}>
                                        <span className={styles['cd-info-icon']}><EnvironmentOutlined /></span>
                                        <div>
                                            <div className={styles['cd-info-label']}>Địa chỉ</div>
                                            <div className={styles['cd-info-value']}>{companyDetail.address}</div>
                                        </div>
                                    </div>
                                )}
                                <div className={styles['cd-info-row']}>
                                    <span className={styles['cd-info-icon']}><TeamOutlined /></span>
                                    <div>
                                        <div className={styles['cd-info-label']}>Quy mô</div>
                                        <div className={styles['cd-info-value']}>100 – 500 nhân viên</div>
                                    </div>
                                </div>
                                <div className={styles['cd-info-row']}>
                                    <span className={styles['cd-info-icon']}><GlobalOutlined /></span>
                                    <div>
                                        <div className={styles['cd-info-label']}>Lĩnh vực</div>
                                        <div className={styles['cd-info-value']}>Công nghệ thông tin</div>
                                    </div>
                                </div>
                                {founded && (
                                    <div className={styles['cd-info-row']}>
                                        <span className={styles['cd-info-icon']}><CalendarOutlined /></span>
                                        <div>
                                            <div className={styles['cd-info-label']}>Thành lập</div>
                                            <div className={styles['cd-info-value']}>{founded}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles['cd-divider']} />

                            <div className={styles['cd-sidebar-actions']}>
                                <button
                                    className={styles['cd-btn-primary']}
                                    onClick={() => navigate(`/job?company=${companyDetail.id}`)}
                                >
                                    Xem việc làm
                                </button>
                                <div className={styles['cd-btn-row']}>
                                    <button
                                        className={`${styles['cd-btn-ghost']} ${saved ? styles['cd-btn-saved'] : ''}`}
                                        onClick={() => setSaved(!saved)}
                                    >
                                        <HeartOutlined />
                                        {saved ? 'Đã lưu' : 'Lưu'}
                                    </button>
                                    <button
                                        className={styles['cd-btn-ghost']}
                                        onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                    >
                                        <ShareAltOutlined />
                                        Chia sẻ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClientCompanyDetailPage;
