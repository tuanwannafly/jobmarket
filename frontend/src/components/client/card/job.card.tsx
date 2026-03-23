import { callFetchJob } from '@/config/api';
import { convertSlug, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { EnvironmentOutlined, ThunderboltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Col, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { sfIn } from 'spring-filter-query-builder';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface IProps {
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [sortQuery] = useState('sort=updatedAt,desc');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => { fetchJob(); }, [current, location]);

    const fetchJob = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}&${sortQuery}`;

        const queryLocation = searchParams.get('location');
        const querySkills   = searchParams.get('skills');
        const queryCompany  = searchParams.get('company');

        const parts: string[] = [];
        if (queryLocation) parts.push(sfIn('location', queryLocation.split(',')).toString());
        if (querySkills)   parts.push(String(sfIn('skills', querySkills.split(','))));
        if (queryCompany)  parts.push(`company.id:'${queryCompany}'`);

        if (parts.length) {
            query += `&filter=${encodeURIComponent(parts.join(' and '))}`;
        }

        const res = await callFetchJob(query);
        if (res?.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`);
    };

    return (
        <div className={styles['card-job-section']}>
            <div className={styles['job-content']}>
                <Spin spinning={isLoading}>
                    <Row gutter={[16, 16]}>
                        {displayJob?.map(item => (
                            <Col span={24} md={12} lg={8} key={item.id}>
                                <div
                                    className={styles['job-card']}
                                    onClick={() => handleViewDetailJob(item)}
                                    style={{ padding: 18 }}
                                >
                                    <div className={styles['card-job-content']}>
                                        {/* LOGO */}
                                        <div className={styles['card-job-left']}>
                                            <img
                                                alt="logo"
                                                src={(item?.company?.logo?.startsWith('http') ? item.company.logo : `${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`)}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        'https://placehold.co/52x52/f1f5f9/94a3b8?text=IT';
                                                }}
                                            />
                                        </div>

                                        {/* INFO */}
                                        <div className={styles['card-job-right']}>
                                            <div className={styles['job-title']}>{item.name}</div>
                                            <div className={styles['job-company']}>{item?.company?.name}</div>

                                            <div className={styles['job-tags']}>
                                                <span className={`${styles['job-tag']} ${styles['salary']}`}>
                                                    <ThunderboltOutlined />
                                                    {(item.salary + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ
                                                </span>
                                                <span className={`${styles['job-tag']} ${styles['location']}`}>
                                                    <EnvironmentOutlined />
                                                    {getLocationName(item.location)}
                                                </span>
                                            </div>

                                            <div className={styles['job-updatedAt']}>
                                                <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                {item.updatedAt
                                                    ? dayjs(item.updatedAt).fromNow()
                                                    : dayjs(item.createdAt).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}

                        {(!displayJob || displayJob.length === 0) && !isLoading && (
                            <Col span={24}>
                                <div className={styles['empty']}>
                                    <Empty description="Không có dữ liệu" />
                                </div>
                            </Col>
                        )}
                    </Row>

                    {showPagination && (
                        <Row justify="center" style={{ marginTop: 32 }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                onChange={(p) => setCurrent(p)}
                            />
                        </Row>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default JobCard;
