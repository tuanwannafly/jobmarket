import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, SearchOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from '@/styles/client.module.scss';

const SearchClient = () => {
    const navigate     = useNavigate();
    const location     = useLocation();
    const [form]       = Form.useForm();
    const [searchParams] = useSearchParams();
    const [optionsSkills, setOptionsSkills] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        if (location.search) {
            const queryLocation = searchParams.get('location');
            const querySkills   = searchParams.get('skills');
            if (queryLocation) form.setFieldValue('location', queryLocation.split(','));
            if (querySkills)   form.setFieldValue('skills',   querySkills.split(','));
        }
    }, [location.search]);

    useEffect(() => { fetchSkill(); }, []);

    const fetchSkill = async () => {
        const res = await callFetchAllSkill('page=1&size=100&sort=createdAt,desc');
        if (res?.data) {
            setOptionsSkills(
                res.data.result?.map(item => ({
                    label: item.name as string,
                    value: item.id + '' as string,
                })) ?? []
            );
        }
    };

    const onFinish = async (values: any) => {
        const parts: string[] = [];
        if (values?.location?.length) parts.push(`location=${values.location.join(',')}`);
        if (values?.skills?.length)   parts.push(`skills=${values.skills.join(',')}`);

        if (!parts.length) {
            notification.warning({
                message: 'Vui lòng chọn ít nhất một tiêu chí tìm kiếm',
                placement: 'topRight',
            });
            return;
        }
        navigate(`/job?${parts.join('&')}`);
    };

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{ render: () => <></> }}
        >
            <div style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: 14,
                letterSpacing: '-0.2px',
            }}>
                🔍 Tìm kiếm việc làm IT phù hợp với bạn
            </div>

            <Row gutter={[12, 12]} align="middle">
                {/* SKILLS */}
                <Col span={24} md={11}>
                    <ProForm.Item name="skills" style={{ margin: 0 }}>
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={<MonitorOutlined style={{ color: '#94a3b8' }} />}
                            style={{ width: '100%' }}
                            placeholder="Kỹ năng: React, Node.js, Java..."
                            optionLabelProp="label"
                            options={optionsSkills}
                            maxTagCount="responsive"
                        />
                    </ProForm.Item>
                </Col>

                {/* LOCATION */}
                <Col span={24} md={8}>
                    <ProForm.Item name="location" style={{ margin: 0 }}>
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={<EnvironmentOutlined style={{ color: '#94a3b8' }} />}
                            style={{ width: '100%' }}
                            placeholder="Địa điểm..."
                            optionLabelProp="label"
                            options={LOCATION_LIST}
                            maxTagCount="responsive"
                        />
                    </ProForm.Item>
                </Col>

                {/* BUTTON */}
                <Col span={24} md={5}>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() => form.submit()}
                        style={{
                            width: '100%',
                            height: 46,
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 14,
                            background: 'linear-gradient(135deg,#2563EB,#0EA5E9)',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </ProForm>
    );
};

export default SearchClient;
