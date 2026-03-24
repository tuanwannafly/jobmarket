import {
    Avatar, Badge, Button, Col, Form, Input, Modal,
    Row, Select, Table, Tabs, Tag, message, notification
} from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, ISubscribers } from "@/types/backend";
import { useState, useEffect } from 'react';
import {
    callChangePassword, callFetchAllSkill, callFetchResumeByUser,
    callGetSubscriberSkills, callCreateSubscriber, callUpdateSubscriber,
    callUpdateUser,
} from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
    MonitorOutlined, UserOutlined, MailOutlined, EnvironmentOutlined,
    LockOutlined, FileTextOutlined, BellOutlined, IdcardOutlined,
    CheckCircleOutlined, CalendarOutlined, ManOutlined, WomanOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

/* ─── STATUS tag colors ─────────────────────────────── */
const STATUS_COLOR: Record<string, { color: string; bg: string; label: string }> = {
    PENDING:  { color: '#d97706', bg: 'rgba(217,119,6,0.1)',   label: 'Chờ duyệt'  },
    APPROVED: { color: '#059669', bg: 'rgba(5,150,105,0.1)',   label: 'Đã duyệt'   },
    REJECTED: { color: '#dc2626', bg: 'rgba(220,38,38,0.1)',   label: 'Từ chối'    },
};

/* ════════════════════════════════════════════════════════
   CV Preview Modal — renders PDF and DOCX inline
   PDF  → iframe (browser native renderer)
   DOCX → Microsoft Office Online embed (no CORS issues)
═════════════════════════════════════════════════════════ */
const CVPreviewModal = ({ url, visible, onClose }: { url: string; visible: boolean; onClose: () => void }) => {
    if (!url) return null;

    const lower = url.toLowerCase();
    const isPdf  = lower.includes('.pdf');
    const isDocx = lower.includes('.docx') || lower.includes('.doc');

    // For PDF on Cloudinary raw: swap resource type so browser gets inline PDF
    const pdfSrc = isPdf && url.includes('/raw/upload/')
        ? url.replace('/raw/upload/', '/raw/upload/fl_attachment:false/')
        : url;

    // Microsoft Office Online Viewer works with any public URL, no CORS, no login
    const officeSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

    const embedSrc = isPdf ? pdfSrc : isDocx ? officeSrc : null;

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <Button icon={<FileTextOutlined />}>Tải xuống</Button>
                </a>
            }
            width="85vw"
            style={{ top: 16 }}
            title={<span><FileTextOutlined style={{ marginRight: 8 }} />Xem CV</span>}
            destroyOnClose
        >
            <div style={{ height: '80vh', background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
                {embedSrc ? (
                    <iframe
                        src={embedSrc}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="CV Preview"
                        allow="fullscreen"
                    />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
                        <FileTextOutlined style={{ fontSize: 48, color: '#cbd5e1' }} />
                        <div style={{ color: '#64748b', fontSize: 14 }}>Định dạng file không hỗ trợ xem trực tuyến.</div>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <Button type="primary" icon={<FileTextOutlined />}>Tải xuống để xem</Button>
                        </a>
                    </div>
                )}
            </div>
        </Modal>
    );
};

/* ════════════════════════════════════════════════════════
   TAB 1 — Rải CV
═════════════════════════════════════════════════════════ */
const UserResume = ({ open }: { open: boolean }) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string; visible: boolean }>({ url: '', visible: false });

    useEffect(() => {
        if (!open) return;
        (async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res?.data) setListCV(res.data.result as IResume[]);
            setIsFetching(false);
        })();
    }, [open]);

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT', key: 'index', width: 56, align: 'center',
            render: (_: any, __: any, i: number) => (
                <span style={{ fontWeight: 700, color: '#64748b' }}>{i + 1}</span>
            ),
        },
        {
            title: 'Công ty', key: 'company',
            render: (_: any, record: IResume) => {
                const companyName = (record as any).companyName;
                return (
                    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>
                        {companyName ?? '—'}
                    </span>
                );
            },
        },
        {
            title: 'Vị trí ứng tuyển', dataIndex: ['job', 'name'],
            render: (v: string) => <span style={{ fontWeight: 500, color: '#334155', fontSize: 13 }}>{v}</span>,
        },
        {
            title: 'Trạng thái', dataIndex: 'status',
            render: (v: string) => {
                const s = STATUS_COLOR[v] ?? { color: '#475569', bg: '#f1f5f9', label: v };
                return (
                    <span style={{
                        display: 'inline-block', padding: '3px 12px', borderRadius: 99,
                        fontSize: 12, fontWeight: 700,
                        color: s.color, background: s.bg,
                        border: `1px solid ${s.color}33`,
                    }}>{s.label}</span>
                );
            },
        },
        {
            title: 'Ngày nộp', dataIndex: 'createdAt',
            render: (v: string) => (
                <span style={{ color: '#64748b', fontSize: 12 }}>
                    {dayjs(v).format('DD/MM/YYYY HH:mm')}
                </span>
            ),
        },
        {
            title: '', key: 'action',
            render: (_: any, r: IResume) => {
                const rawUrl = r.url?.startsWith('http')
                    ? r.url
                    : `${import.meta.env.VITE_BACKEND_URL}/storage/resume/${r.url}`;
                return (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span
                            onClick={() => setPreviewFile({ url: rawUrl, visible: true })}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: 12, fontWeight: 700, color: '#2563EB',
                                cursor: 'pointer',
                            }}
                        >
                            <FileTextOutlined /> Xem CV
                        </span>
                        <a
                            href={rawUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: 12, fontWeight: 700, color: '#64748b',
                                textDecoration: 'none',
                            }}
                            title="Tải xuống"
                        >
                            ↓
                        </a>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <CVPreviewModal
                url={previewFile.url}
                visible={previewFile.visible}
                onClose={() => setPreviewFile({ url: '', visible: false })}
            />
            {listCV.length === 0 && !isFetching ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                    <FileTextOutlined style={{ fontSize: 40, marginBottom: 12, display: 'block' }} />
                    <div style={{ fontWeight: 600 }}>Bạn chưa nộp CV nào</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Hãy tìm việc và ứng tuyển ngay!</div>
                </div>
            ) : (
                <Table<IResume>
                    columns={columns}
                    dataSource={listCV}
                    loading={isFetching}
                    pagination={false}
                    rowKey="id"
                    size="small"
                />
            )}
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   TAB 2 — Nhận Jobs qua Email
═════════════════════════════════════════════════════════ */
const JobByEmail = () => {
    const [form] = Form.useForm();
    const user = useAppSelector(s => s.account.user);
    const [optionsSkills, setOptionsSkills] = useState<{ label: string; value: string }[]>([]);
    const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const skillRes = await callFetchAllSkill('page=1&size=100&sort=createdAt,desc');
            if (skillRes?.data) {
                setOptionsSkills(skillRes.data.result?.map(i => ({ label: i.name as string, value: i.id + '' })) ?? []);
            }
            const subRes = await callGetSubscriberSkills();
            if (subRes?.data) {
                setSubscriber(subRes.data);
                form.setFieldValue('skills', subRes.data.skills.map((s: any) => ({ label: s.name, value: s.id + '' })));
            }
        })();
    }, []);

    const onFinish = async (values: any) => {
        setLoading(true);
        const arr = values.skills?.map((i: any) => ({ id: i?.id ?? i }));
        const payload = { email: user.email, name: user.name, skills: arr };
        const res = subscriber?.id
            ? await callUpdateSubscriber({ id: subscriber.id, skills: arr })
            : await callCreateSubscriber(payload);
        setLoading(false);
        if (res?.data) {
            message.success('Cập nhật kỹ năng nhận Job thành công!');
            setSubscriber(res.data);
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
    };

    return (
        <div>
            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <BellOutlined style={{ color: '#2563EB', fontSize: 16, marginTop: 2 }} />
                <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>Nhận thông báo việc làm qua email</div>
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                        Chọn kỹ năng bạn quan tâm — chúng tôi sẽ gửi email khi có Job mới phù hợp.
                    </div>
                </div>
            </div>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label={<span style={{ fontWeight: 700, color: '#0F172A' }}>Kỹ năng quan tâm</span>}
                    name="skills"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
                >
                    <Select
                        mode="multiple" allowClear
                        suffixIcon={<MonitorOutlined style={{ color: '#94a3b8' }} />}
                        style={{ width: '100%' }}
                        placeholder="Tìm theo kỹ năng..."
                        optionLabelProp="label"
                        options={optionsSkills}
                        size="large"
                    />
                </Form.Item>
                <Button
                    type="primary" onClick={() => form.submit()} loading={loading}
                    style={{ background: 'linear-gradient(135deg,#2563EB,#0EA5E9)', border: 'none', height: 42, borderRadius: 8, fontWeight: 700, paddingInline: 28 }}
                >
                    Lưu cài đặt
                </Button>
            </Form>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   TAB 3 — Cập nhật thông tin
═════════════════════════════════════════════════════════ */
const UserUpdateInfo = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(s => s.account.user);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            name:    user.name,
            email:   user.email,
            age:     (user as any).age,
            gender:  (user as any).gender,
            address: (user as any).address,
        });
    }, [user]);

    const onFinish = async (values: any) => {
        setLoading(true);
        const res = await callUpdateUser({ id: user.id, ...values } as any);
        setLoading(false);
        if (res?.data) {
            message.success('Cập nhật thông tin thành công!');
            dispatch(setUserLoginInfo({ ...user, ...res.data }));
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={[20, 0]}>
                <Col span={24} md={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: 700 }}>Họ và tên</span>}
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Nguyễn Văn A" size="large" />
                    </Form.Item>
                </Col>
                <Col span={24} md={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: 700 }}>Email</span>}
                        name="email"
                    >
                        <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} disabled size="large" />
                    </Form.Item>
                </Col>
                <Col span={24} md={6}>
                    <Form.Item
                        label={<span style={{ fontWeight: 700 }}>Tuổi</span>}
                        name="age"
                        rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                    >
                        <Input prefix={<CalendarOutlined style={{ color: '#94a3b8' }} />} type="number" placeholder="25" size="large" />
                    </Form.Item>
                </Col>
                <Col span={24} md={6}>
                    <Form.Item
                        label={<span style={{ fontWeight: 700 }}>Giới tính</span>}
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Select size="large" placeholder="Chọn giới tính" options={[
                            { label: 'Nam', value: 'MALE' },
                            { label: 'Nữ', value: 'FEMALE' },
                            { label: 'Khác', value: 'OTHER' },
                        ]} />
                    </Form.Item>
                </Col>
                <Col span={24} md={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: 700 }}>Địa chỉ</span>}
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input prefix={<EnvironmentOutlined style={{ color: '#94a3b8' }} />} placeholder="TP. Hồ Chí Minh" size="large" />
                    </Form.Item>
                </Col>
            </Row>
            <Button
                type="primary" onClick={() => form.submit()} loading={loading}
                style={{ background: 'linear-gradient(135deg,#2563EB,#0EA5E9)', border: 'none', height: 42, borderRadius: 8, fontWeight: 700, paddingInline: 28 }}
            >
                Lưu thay đổi
            </Button>
        </Form>
    );
};

/* ════════════════════════════════════════════════════════
   TAB 4 — Thay đổi mật khẩu
═════════════════════════════════════════════════════════ */
const UserPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        const { currentPassword, newPassword, confirmPassword } = values;
        if (newPassword !== confirmPassword) {
            form.setFields([{ name: 'confirmPassword', errors: ['Mật khẩu xác nhận không khớp!'] }]);
            return;
        }
        setLoading(true);
        const res = await callChangePassword({ currentPassword, newPassword });
        setLoading(false);
        if (res?.data) {
            message.success('Đổi mật khẩu thành công!');
            form.resetFields();
        } else {
            notification.error({ message: 'Đổi mật khẩu thất bại', description: res.message ?? 'Mật khẩu hiện tại không đúng' });
        }
    };

    return (
        <div style={{ maxWidth: 440 }}>
            <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12 }}>
                <LockOutlined style={{ color: '#dc2626', fontSize: 16, marginTop: 2 }} />
                <div style={{ color: '#64748b', fontSize: 13 }}>
                    Mật khẩu phải có ít nhất <strong>6 ký tự</strong>. Không chia sẻ mật khẩu với bất kỳ ai.
                </div>
            </div>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label={<span style={{ fontWeight: 700 }}>Mật khẩu hiện tại</span>}
                    name="currentPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                >
                    <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" size="large" />
                </Form.Item>
                <Form.Item
                    label={<span style={{ fontWeight: 700 }}>Mật khẩu mới</span>}
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Tối thiểu 6 ký tự!' }]}
                >
                    <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" size="large" />
                </Form.Item>
                <Form.Item
                    label={<span style={{ fontWeight: 700 }}>Xác nhận mật khẩu mới</span>}
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                >
                    <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" size="large" />
                </Form.Item>
                <Button
                    type="primary" danger onClick={() => form.submit()} loading={loading}
                    style={{ height: 42, borderRadius: 8, fontWeight: 700, paddingInline: 28 }}
                >
                    Đổi mật khẩu
                </Button>
            </Form>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   TAB 5 — Hồ sơ ứng viên (MỚI)
═════════════════════════════════════════════════════════ */
const UserProfile = () => {
    const user = useAppSelector(s => s.account.user);
    const u = user as any;

    const GENDER_LABEL: Record<string, string> = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };

    const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number }) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ width: 36, height: 36, background: 'rgba(37,99,235,0.08)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: value ? '#0F172A' : '#cbd5e1' }}>{value ?? 'Chưa cập nhật'}</div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Profile header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: 'linear-gradient(135deg,#060D1F,#0F2552)', borderRadius: 16, marginBottom: 24 }}>
                <Avatar
                    size={72}
                    style={{ background: 'linear-gradient(135deg,#2563EB,#0EA5E9)', fontSize: 28, fontWeight: 800, flexShrink: 0 }}
                >
                    {user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', marginBottom: 4 }}>
                        {user.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>{user.email}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 99, color: '#34d399', fontSize: 11, fontWeight: 700, padding: '3px 12px' }}>
                            <CheckCircleOutlined /> Đã xác thực
                        </span>
                        {user.role?.name && user.role.name !== 'NORMAL_USER' && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.38)', borderRadius: 99, color: '#93c5fd', fontSize: 11, fontWeight: 700, padding: '3px 12px' }}>
                                {user.role.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info grid */}
            <Row gutter={[20, 0]}>
                <Col span={24} md={12}>
                    <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '4px 20px 8px' }}>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A', padding: '16px 0 8px', letterSpacing: '-0.2px' }}>
                            Thông tin cá nhân
                        </div>
                        <InfoRow icon={<UserOutlined />}      label="Họ và tên"  value={user.name} />
                        <InfoRow icon={<MailOutlined />}       label="Email"      value={user.email} />
                        <InfoRow icon={<CalendarOutlined />}   label="Tuổi"       value={u.age ? `${u.age} tuổi` : undefined} />
                        <InfoRow icon={u.gender === 'FEMALE' ? <WomanOutlined /> : <ManOutlined />}
                                 label="Giới tính"  value={GENDER_LABEL[u.gender] ?? u.gender} />
                        <InfoRow icon={<EnvironmentOutlined />} label="Địa chỉ"  value={u.address} />
                    </div>
                </Col>
                <Col span={24} md={12}>
                    <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '4px 20px 8px' }}>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A', padding: '16px 0 8px' }}>
                            Thông tin tài khoản
                        </div>
                        <InfoRow icon={<IdcardOutlined />} label="ID tài khoản" value={user.id} />
                        <InfoRow icon={<CheckCircleOutlined />} label="Vai trò"
                            value={user.role?.name === 'NORMAL_USER' ? 'Ứng viên' : user.role?.name} />
                        {u.company?.name && (
                            <InfoRow icon={<UserOutlined />} label="Công ty" value={u.company.name} />
                        )}
                        <div style={{ padding: '14px 0' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Quyền hạn</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {user.role?.permissions?.slice(0, 6).map((p, i) => (
                                    <span key={i} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(37,99,235,0.07)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 6, padding: '3px 10px' }}>
                                        {p.name}
                                    </span>
                                ))}
                                {(user.role?.permissions?.length ?? 0) > 6 && (
                                    <span style={{ fontSize: 11, color: '#94a3b8', padding: '3px 8px' }}>
                                        +{(user.role?.permissions?.length ?? 0) - 6} khác
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   MAIN MODAL
═════════════════════════════════════════════════════════ */
const ManageAccount = ({ open, onClose }: IProps) => {
    const items: TabsProps['items'] = [
        {
            key: 'user-profile',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IdcardOutlined /> Hồ sơ
                </span>
            ),
            children: <UserProfile />,
        },
        {
            key: 'user-resume',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileTextOutlined /> Rải CV
                </span>
            ),
            children: <UserResume open={open} />,
        },
        {
            key: 'email-by-skills',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BellOutlined /> Nhận Jobs qua Email
                </span>
            ),
            children: <JobByEmail />,
        },
        {
            key: 'user-update-info',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserOutlined /> Cập nhật thông tin
                </span>
            ),
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LockOutlined /> Đổi mật khẩu
                </span>
            ),
            children: <UserPassword />,
        },
    ];

    return (
        <Modal
            title={
                <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
                    Quản lý tài khoản
                </span>
            }
            open={open}
            onCancel={() => onClose(false)}
            maskClosable={false}
            footer={null}
            destroyOnClose
            width={isMobile ? '100%' : 960}
            styles={{ body: { padding: '8px 24px 24px' } }}
        >
            <div style={{ minHeight: 420 }}>
                <Tabs defaultActiveKey="user-profile" items={items} />
            </div>
        </Modal>
    );
};

export default ManageAccount;
