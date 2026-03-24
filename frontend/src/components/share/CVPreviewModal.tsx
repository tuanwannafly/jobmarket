/**
 * CVPreviewModal — shared component dùng ở cả admin và client
 *
 * Chiến lược xem:
 *  - PDF  → Google Docs Viewer — không bị CORS với Cloudinary URL
 *  - DOCX → Office Online Viewer (Microsoft)
 *
 * Chiến lược tải:
 *  - Dùng fetch + Blob để tải cross-origin, đảm bảo file có đúng tên + extension
 */

import { Button, Modal, Spin } from "antd";
import { FileTextOutlined, DownloadOutlined, WarningOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

interface CVPreviewModalProps {
    url: string;
    visible: boolean;
    onClose: () => void;
}

/* ─── Helpers ─────────────────────────────────────── */

/** Lấy extension thực từ URL (bỏ query params, lowercase) */
function getExt(url: string): string {
    const clean = url.split("?")[0].toLowerCase();
    const match = clean.match(/\.(pdf|docx|doc)(?=$|[^a-z])/);
    return match ? match[1] : "";
}

/** Lấy tên file từ URL (phần cuối path, bỏ query params) */
function getFilename(url: string): string {
    const clean = url.split("?")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || "cv-file";
}

/**
 * Tải file qua fetch + Blob rồi trigger download.
 * Cách này đảm bảo:
 *  1. File cross-origin (Cloudinary) được tải đúng
 *  2. Tên file + extension được giữ nguyên
 *  3. Trình duyệt không cố mở inline thay vì tải xuống
 */
async function downloadFile(url: string): Promise<void> {
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Fetch failed");
        const blob = await resp.blob();

        // Ưu tiên lấy tên từ URL (đã có extension vì BE đặt public_id có extension)
        let filename = getFilename(url);
        const ext = getExt(url);

        // Nếu tên file không có extension thì thêm vào
        if (ext && !filename.toLowerCase().endsWith(`.${ext}`)) {
            filename = `${filename}.${ext}`;
        }

        // Đảm bảo blob có đúng MIME type
        const mimeMap: Record<string, string> = {
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
        const mime = mimeMap[ext] ?? blob.type ?? "application/octet-stream";
        const typedBlob = new Blob([blob], { type: mime });

        const objUrl = URL.createObjectURL(typedBlob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
    } catch {
        // Fallback: mở tab mới nếu fetch thất bại
        window.open(url, "_blank");
    }
}

/**
 * Với Cloudinary raw URL, đảm bảo cuối path có extension để
 * Google Docs Viewer / Office Viewer nhận dạng đúng loại file.
 */
function ensureExtInUrl(rawUrl: string, ext: string): string {
    if (!ext || !rawUrl) return rawUrl;
    const [base, query] = rawUrl.split("?");
    if (base.toLowerCase().endsWith(`.${ext}`)) return rawUrl;
    if (rawUrl.includes("res.cloudinary.com") && rawUrl.includes("/raw/upload/")) {
        const newBase = `${base}.${ext}`;
        return query ? `${newBase}?${query}` : newBase;
    }
    return rawUrl;
}

/* ─── Component ───────────────────────────────────── */

const CVPreviewModal = ({ url, visible, onClose }: CVPreviewModalProps) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        setIframeLoaded(false);
        setIframeError(false);
    }, [url, visible]);

    if (!url) return null;

    const ext = getExt(url);
    const isPdf = ext === "pdf";
    const isDocx = ext === "docx" || ext === "doc";

    const viewUrl = ensureExtInUrl(url, ext);

    let embedSrc: string;
    if (isPdf) {
        embedSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(viewUrl)}&embedded=true`;
    } else if (isDocx) {
        embedSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewUrl)}`;
    } else {
        embedSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(viewUrl)}&embedded=true`;
    }

    const handleDownload = async () => {
        setDownloading(true);
        await downloadFile(url);
        setDownloading(false);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={downloading}
                    onClick={handleDownload}
                >
                    Tải xuống
                </Button>
            }
            width="88vw"
            style={{ top: 12 }}
            styles={{ body: { padding: 0 } }}
            title={
                <span>
                    <FileTextOutlined style={{ marginRight: 8, color: "#2563eb" }} />
                    Xem CV
                </span>
            }
            destroyOnClose
        >
            <div
                style={{
                    height: "82vh",
                    background: "#f1f5f9",
                    borderRadius: "0 0 8px 8px",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {!iframeLoaded && !iframeError && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            background: "#f1f5f9",
                            zIndex: 2,
                        }}
                    >
                        <Spin size="large" />
                        <span style={{ color: "#64748b", fontSize: 14 }}>Đang tải CV...</span>
                    </div>
                )}

                {iframeError && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            background: "#f1f5f9",
                            zIndex: 2,
                        }}
                    >
                        <WarningOutlined style={{ fontSize: 40, color: "#f59e0b" }} />
                        <span style={{ color: "#374151", fontWeight: 500 }}>
                            Không thể xem trực tuyến
                        </span>
                        <span style={{ color: "#6b7280", fontSize: 13 }}>
                            Vui lòng tải về để xem file
                        </span>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            loading={downloading}
                            onClick={handleDownload}
                        >
                            Tải xuống ngay
                        </Button>
                    </div>
                )}

                <iframe
                    key={embedSrc}
                    src={embedSrc}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: iframeError ? "none" : "block",
                    }}
                    title="CV Preview"
                    allow="fullscreen"
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setIframeError(true)}
                />
            </div>
        </Modal>
    );
};

export default CVPreviewModal;
