import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Skeleton } from "antd";
import {
    ArrowLeftOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    TrophyOutlined,
    CalendarOutlined,
    FireOutlined,
    ShareAltOutlined,
    HeartOutlined,
    CheckCircleOutlined,
    BankOutlined,
} from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
dayjs.extend(relativeTime);

const LEVEL_MAP: Record<string, { label: string; color: string; bg: string }> = {
    INTERN:      { label: 'Thực tập sinh', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
    FRESHER:     { label: 'Fresher',        color: '#0891b2', bg: 'rgba(8,145,178,0.08)'  },
    JUNIOR:      { label: 'Junior',         color: '#059669', bg: 'rgba(5,150,105,0.08)'  },
    MIDDLE:      { label: 'Middle',         color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
    SENIOR:      { label: 'Senior',         color: '#dc2626', bg: 'rgba(220,38,38,0.08)'  },
    LEADER:      { label: 'Leader',         color: '#2563eb', bg: 'rgba(37,99,235,0.08)'  },
};

const ClientJobDetailPage = () => {
    const [jobDetail, setJobDetail]     = useState<IJob | null>(null);
    const [isLoading, setIsLoading]     = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imgError, setImgError]       = useState(false);
    const [saved, setSaved]             = useState(false);

    const navigate  = useNavigate();
    const location  = useLocation();
    const id        = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        const init = async () => {
            if (!id) return;
            setIsLoading(true);
            const res = await callFetchJobById(id);
            if (res?.data) setJobDetail(res.data);
            setIsLoading(false);
        };
        init();
    }, [id]);

    const logoSrc = jobDetail?.company?.logo
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company.logo}`
        : null;

    const timeAgo   = jobDetail?.updatedAt
        ? dayjs(jobDetail.updatedAt).fromNow()
        : jobDetail?.createdAt ? dayjs(jobDetail.createdAt).fromNow() : '';

    const deadline  = jobDetail?.endDate
        ? dayjs(jobDetail.endDate).format('DD/MM/YYYY')
        : null;

    const daysLeft  = jobDetail?.endDate
        ? dayjs(jobDetail.endDate).diff(dayjs(), 'day')
        : null;

    const levelInfo = jobDetail?.level ? LEVEL_MAP[jobDetail.level] ?? null : null;

    const salaryFormatted = jobDetail?.salary
        ? (jobDetail.salary + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'
        : null;

    if (isLoading) return (
        <div className={styles['jd-loading']}>
            <div className={styles['jd-loading-hero']} />
            <div className={styles['jd-loading-body']}>
                <div style={{ flex: 1 }}><Skeleton active paragraph={{ rows: 10 }} /></div>
                <div style={{ width: 300 }}><Skeleton active paragraph={{ rows: 6 }} /></div>
            </div>
        </div>
    );

    if (!jobDetail?.id) return null;

    return (
        <div className={styles['jd-page']}>

            {/* ══ HERO ══ */}
            <div className={styles['jd-hero']}>
                <div className={styles['jd-hero-mesh']} />
                <div className={styles['jd-hero-inner']}>

                    <button className={styles['jd-back']} onClick={() => navigate(-1)}>
                        <ArrowLeftOutlined /> <span>Quay lại</span>
                    </button>

                    <div className={styles['jd-hero-body']}>
                        {/* Company logo */}
                        <div className={styles['jd-hero-logo']}>
                            {!imgError && logoSrc ? (
                                <img src={logoSrc} alt={jobDetail.company?.name} onError={() => setImgError(true)} />
                            ) : (
                                <BankOutlined style={{ fontSize: 36, color: '#2563EB' }} />
                            )}
                        </div>

                        {/* Job info */}
                        <div className={styles['jd-hero-info']}>
                            {jobDetail.active && (
                                <div className={styles['jd-hero-badge']}>
                                    <FireOutlined /> Đang tuyển dụng
                                </div>
                            )}
                            <h1 className={styles['jd-hero-title']}>{jobDetail.name}</h1>

                            <div
                                className={styles['jd-hero-company']}
                                onClick={() => jobDetail.company?.id &&
                                    navigate(`/company/${jobDetail.company.name}?id=${jobDetail.company.id}`)
                                }
                            >
                                {jobDetail.company?.name}
                            </div>

                            <div className={styles['jd-hero-chips']}>
                                {salaryFormatted && (
                                    <span className={styles['jd-chip-green']}>
                                        <DollarOutlined /> {salaryFormatted}
                                    </span>
                                )}
                                <span className={styles['jd-chip']}>
                                    <EnvironmentOutlined /> {getLocationName(jobDetail.location)}
                                </span>
                                {levelInfo && (
                                    <span className={styles['jd-chip']}>
                                        <TrophyOutlined /> {levelInfo.label}
                                    </span>
                                )}
                                {timeAgo && (
                                    <span className={styles['jd-chip']}>
                                        <ClockCircleOutlined /> {timeAgo}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA right */}
                        <div className={styles['jd-hero-cta']}>
                            <button
                                className={styles['jd-btn-apply-hero']}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ứng tuyển ngay
                            </button>
                            <div className={styles['jd-hero-cta-row']}>
                                <button
                                    className={`${styles['jd-btn-icon']} ${saved ? styles['jd-btn-icon-saved'] : ''}`}
                                    onClick={() => setSaved(!saved)}
                                >
                                    <HeartOutlined />
                                </button>
                                <button
                                    className={styles['jd-btn-icon']}
                                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                >
                                    <ShareAltOutlined />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ BODY ══ */}
            <div className={styles['jd-body']}>
                <div className={styles['jd-body-inner']}>

                    {/* LEFT — description */}
                    <div className={styles['jd-content']}>

                        {/* Skills */}
                        {jobDetail.skills?.length > 0 && (
                            <div className={styles['jd-card']}>
                                <div className={styles['jd-card-header']}>
                                    <span className={styles['jd-card-accent']} />
                                    <h2 className={styles['jd-card-title']}>Kỹ năng yêu cầu</h2>
                                </div>
                                <div className={styles['jd-skills']}>
                                    {jobDetail.skills.map((s, i) => (
                                        <span key={i} className={styles['jd-skill-tag']}>{s.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className={styles['jd-card']}>
                            <div className={styles['jd-card-header']}>
                                <span className={styles['jd-card-accent']} />
                                <h2 className={styles['jd-card-title']}>Mô tả công việc</h2>
                            </div>
                            <div className={styles['jd-description']}>
                                {parse(jobDetail.description ?? '')}
                            </div>
                        </div>

                        {/* Bottom apply */}
                        <div className={styles['jd-apply-bar']}>
                            <div>
                                <div className={styles['jd-apply-bar-title']}>Quan tâm đến vị trí này?</div>
                                <div className={styles['jd-apply-bar-sub']}>Ứng tuyển ngay để không bỏ lỡ cơ hội</div>
                            </div>
                            <button
                                className={styles['jd-btn-apply-bar']}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ứng tuyển ngay
                            </button>
                        </div>
                    </div>

                    {/* RIGHT — sidebar */}
                    <div className={styles['jd-sidebar']}>

                        {/* Apply card */}
                        <div className={styles['jd-sidebar-apply']}>
                            <button
                                className={styles['jd-btn-apply-full']}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ứng tuyển ngay
                            </button>

                            {daysLeft !== null && (
                                <div className={`${styles['jd-deadline']} ${daysLeft <= 3 ? styles['jd-deadline-urgent'] : ''}`}>
                                    {daysLeft <= 0
                                        ? '⚠️ Đã hết hạn ứng tuyển'
                                        : daysLeft <= 3
                                            ? `⚡ Còn ${daysLeft} ngày để ứng tuyển`
                                            : `📅 Hạn nộp: ${deadline}`
                                    }
                                </div>
                            )}

                            <div className={styles['jd-btn-row']}>
                                <button
                                    className={`${styles['jd-btn-ghost']} ${saved ? styles['jd-btn-saved'] : ''}`}
                                    onClick={() => setSaved(!saved)}
                                >
                                    <HeartOutlined /> {saved ? 'Đã lưu' : 'Lưu'}
                                </button>
                                <button
                                    className={styles['jd-btn-ghost']}
                                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                >
                                    <ShareAltOutlined /> Chia sẻ
                                </button>
                            </div>
                        </div>

                        {/* Job meta */}
                        <div className={styles['jd-sidebar-meta']}>
                            <div className={styles['jd-card-header']}>
                                <span className={styles['jd-card-accent']} />
                                <h2 className={styles['jd-card-title']}>Thông tin công việc</h2>
                            </div>

                            <div className={styles['jd-meta-list']}>
                                {levelInfo && (
                                    <div className={styles['jd-meta-row']}>
                                        <span className={styles['jd-meta-icon']}><TrophyOutlined /></span>
                                        <div>
                                            <div className={styles['jd-meta-label']}>Cấp độ</div>
                                            <span
                                                className={styles['jd-level-badge']}
                                                style={{ color: levelInfo.color, background: levelInfo.bg, border: `1px solid ${levelInfo.color}33` }}
                                            >
                                                {levelInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {salaryFormatted && (
                                    <div className={styles['jd-meta-row']}>
                                        <span className={styles['jd-meta-icon']}><DollarOutlined /></span>
                                        <div>
                                            <div className={styles['jd-meta-label']}>Mức lương</div>
                                            <div className={styles['jd-meta-value']} style={{ color: '#059669', fontWeight: 700 }}>
                                                {salaryFormatted}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={styles['jd-meta-row']}>
                                    <span className={styles['jd-meta-icon']}><EnvironmentOutlined /></span>
                                    <div>
                                        <div className={styles['jd-meta-label']}>Địa điểm</div>
                                        <div className={styles['jd-meta-value']}>{getLocationName(jobDetail.location)}</div>
                                    </div>
                                </div>
                                {jobDetail.quantity && (
                                    <div className={styles['jd-meta-row']}>
                                        <span className={styles['jd-meta-icon']}><TeamOutlined /></span>
                                        <div>
                                            <div className={styles['jd-meta-label']}>Số lượng tuyển</div>
                                            <div className={styles['jd-meta-value']}>{jobDetail.quantity} người</div>
                                        </div>
                                    </div>
                                )}
                                {deadline && (
                                    <div className={styles['jd-meta-row']}>
                                        <span className={styles['jd-meta-icon']}><CalendarOutlined /></span>
                                        <div>
                                            <div className={styles['jd-meta-label']}>Hạn nộp hồ sơ</div>
                                            <div className={styles['jd-meta-value']}>{deadline}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Company card */}
                        {jobDetail.company && (
                            <div
                                className={styles['jd-sidebar-company']}
                                onClick={() => jobDetail.company?.id &&
                                    navigate(`/company/${jobDetail.company.name}?id=${jobDetail.company.id}`)
                                }
                            >
                                <div className={styles['jd-company-logo']}>
                                    {!imgError && logoSrc ? (
                                        <img src={logoSrc} alt={jobDetail.company.name} onError={() => setImgError(true)} />
                                    ) : (
                                        <BankOutlined style={{ fontSize: 28, color: '#2563EB' }} />
                                    )}
                                </div>
                                <div className={styles['jd-company-info']}>
                                    <div className={styles['jd-company-name']}>{jobDetail.company.name}</div>
                                    <div className={styles['jd-company-link']}>Xem trang công ty →</div>
                                </div>
                                <CheckCircleOutlined className={styles['jd-company-verified']} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
        </div>
    );
};

export default ClientJobDetailPage;
