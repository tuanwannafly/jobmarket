import { callUpdateResumeStatus } from "@/config/api";
import { IResume } from "@/types/backend";
import { Button, Descriptions, Drawer, Form, Select, message, notification } from "antd";
import { FileTextOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import CVPreviewModal from "@/components/share/CVPreviewModal";
const { Option } = Select;

/** Tải file qua fetch+Blob để đảm bảo đúng tên + extension khi download cross-origin */
async function downloadFile(url: string): Promise<void> {
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Fetch failed");
        const blob = await resp.blob();
        const clean = url.split("?")[0];
        const extMatch = clean.toLowerCase().match(/\.(pdf|docx|doc)(?=$|[^a-z])/);
        const ext = extMatch ? extMatch[1] : "";
        const parts = clean.split("/");
        let filename = parts[parts.length - 1] || "cv-file";
        if (ext && !filename.toLowerCase().endsWith(`.${ext}`)) filename = `${filename}.${ext}`;
        const mimeMap: Record<string, string> = {
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
        const typedBlob = new Blob([blob], { type: mimeMap[ext] ?? "application/octet-stream" });
        const objUrl = URL.createObjectURL(typedBlob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
    } catch {
        window.open(url, "_blank");
    }
}

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IResume | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

/* ─── Main Drawer ─────────────────────────────────── */
const ViewDetailResume = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);
        const status = form.getFieldValue('status');
        const res = await callUpdateResumeStatus(dataInit?.id, status);
        if (res.data) {
            message.success("Update Resume status thành công!");
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        if (dataInit) form.setFieldValue("status", dataInit.status);
        return () => form.resetFields();
    }, [dataInit]);

    const cvUrl = dataInit?.url
        ? (dataInit.url.startsWith('http') ? dataInit.url : `${import.meta.env.VITE_BACKEND_URL}/storage/resume/${dataInit.url}`)
        : '';

    return (
        <>
            <CVPreviewModal
                url={cvUrl}
                visible={previewVisible}
                onClose={() => setPreviewVisible(false)}
            />
            <Drawer
                title="Thông Tin Resume"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null); }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                extra={
                    <div style={{ display: 'flex', gap: 8 }}>
                        {cvUrl && (
                            <Button
                                icon={<FileTextOutlined />}
                                onClick={() => setPreviewVisible(true)}
                            >
                                Xem CV
                            </Button>
                        )}
                        <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                            Change Status
                        </Button>
                    </div>
                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form form={form}>
                            <Form.Item name={"status"}>
                                <Select style={{ width: "100%" }} defaultValue={dataInit?.status}>
                                    <Option value="PENDING">PENDING</Option>
                                    <Option value="REVIEWING">REVIEWING</Option>
                                    <Option value="APPROVED">APPROVED</Option>
                                    <Option value="REJECTED">REJECTED</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Job">{dataInit?.job?.name}</Descriptions.Item>
                    <Descriptions.Item label="Tên Công Ty">{dataInit?.companyName}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {dataInit?.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit?.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    {cvUrl && (
                        <Descriptions.Item label="File CV" span={2}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Button
                                    size="small"
                                    icon={<FileTextOutlined />}
                                    type="primary"
                                    onClick={() => setPreviewVisible(true)}
                                >
                                    Xem CV
                                </Button>
                                <Button
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    loading={isDownloading}
                                    onClick={async () => {
                                        setIsDownloading(true);
                                        await downloadFile(cvUrl);
                                        setIsDownloading(false);
                                    }}
                                >
                                    Tải xuống
                                </Button>
                            </div>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Drawer>
        </>
    );
};

export default ViewDetailResume;
