import { callFetchCompany, callFetchJob } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { Col, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [jobCounts, setJobCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(8);
    const [total, setTotal] = useState(0);

    const navigate = useNavigate();

    useEffect(() => { fetchCompany(); }, [current, pageSize]);

    const fetchCompany = async () => {
        setIsLoading(true);
        const res = await callFetchCompany(`page=${current}&size=${pageSize}&sort=updatedAt,desc`);
        if (res?.data) {
            const companies = res.data.result;
            setDisplayCompany(companies);
            setTotal(res.data.meta.total);

            // Fetch job count thật cho từng công ty song song
            const counts = await Promise.all(
                companies.map(async (c) => {
                    if (!c.id) return { id: c.id, count: 0 };
                    try {
                        const filter = encodeURIComponent(`company.id:'${c.id}'`);
                        const jobRes = await callFetchJob(`page=1&size=1&filter=${filter}`);
                        return { id: c.id, count: jobRes?.data?.meta?.total ?? 0 };
                    } catch {
                        return { id: c.id, count: 0 };
                    }
                })
            );

            const countMap: Record<string, number> = {};
            counts.forEach(({ id, count }) => { if (id) countMap[id] = count; });
            setJobCounts(countMap);
        }
        setIsLoading(false);
    };

    const handleViewDetailCompany = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item.id}`);
        }
    };

    return (
        <div className={styles['company-section']}>
            <div className={styles['company-content']}>
                <Spin spinning={isLoading}>
                    <Row gutter={[20, 20]}>
                        {displayCompany?.map((item, idx) => (
                            <Col xs={12} sm={8} md={6} lg={6} key={item.id}>
                                <div
                                    className={styles['company-card']}
                                    onClick={() => handleViewDetailCompany(item)}
                                    style={{ padding: '24px 16px', textAlign: 'center' }}
                                >
                                    {/* HOT BADGE — show for first 4 */}
                                    {idx < 4 && (
                                        <div className={styles['company-badge']}>🔥 Hot</div>
                                    )}

                                    {/* LOGO */}
                                    <div className={styles['company-logo']}>
                                        <img
                                            src={(item?.logo?.startsWith('http') ? item.logo : `${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.logo}`)}
                                            alt={item.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://placehold.co/80x80/f1f5f9/94a3b8?text=IT';
                                            }}
                                        />
                                    </div>

                                    {/* NAME */}
                                    <div className={styles['company-name']}>{item.name}</div>

                                    {/* JOB COUNT — thật, lấy từ API */}
                                    <div className={styles['company-meta']}>
                                        💼 {item.id && jobCounts[item.id] !== undefined
                                            ? `${jobCounts[item.id]} jobs`
                                            : '...'
                                        }
                                    </div>
                                </div>
                            </Col>
                        ))}

                        {(!displayCompany || displayCompany.length === 0) && !isLoading && (
                            <Col span={24}>
                                <div className={styles['empty']}>
                                    <Empty description="Không có dữ liệu" />
                                </div>
                            </Col>
                        )}
                    </Row>

                    {showPagination && (
                        <Row justify="center" style={{ marginTop: 40 }}>
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

export default CompanyCard;
