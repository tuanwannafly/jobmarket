/**
 * CVPreviewModal — shared component dùng ở cả admin và client
 *
 * Chiến lược xem:
 *  - PDF  → PDF.js (Mozilla) via CDN — render trực tiếp, không cần Google Docs Viewer
 *  - DOCX → Office Online Viewer (Microsoft)
 *
 * Chiến lược tải:
 *  - Cloudinary raw URL → thêm fl_attachment transform để giữ đúng tên + extension
 *  - URL thường → tải thẳng
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

/**
 * Với Cloudinary raw URL, thêm fl_attachment transform để tải đúng tên file.
 * Ví dụ: /raw/upload/v1/resume/cv_abc123.pdf
 *      → /raw/upload/fl_attachment:cv_abc123.pdf/v1/resume/cv_abc123.pdf
 */
function buildDownloadUrl(rawUrl: string): string {
    if (!rawUrl.includes("res.cloudinary.com") || !rawUrl.includes("/raw/upload/")) {
        return rawUrl;
    }
    try {
        const ext = getExt(rawUrl);
        const pathAfterUpload = rawUrl.split("/raw/upload/")[1]; // "v123/resume/file_abc"
        const segments = pathAfterUpload.split("/");
        let filename = segments[segments.length - 1].split("?")[0]; // "file_abc" hoặc "file_abc.pdf"
        // Nếu chưa có extension thì gắn thêm
        if (ext && !filename.toLowerCase().endsWith(`.${ext}`)) {
            filename = `${filename}.${ext}`;
        }
        return rawUrl.replace("/raw/upload/", `/raw/upload/fl_attachment:${filename}/`);
    } catch {
        return rawUrl;
    }
}

/**
 * Với Cloudinary raw URL không có extension trong path, thêm ext vào cuối
 * để PDF.js / Office Viewer nhận dạng đúng.
 * Cloudinary cho phép thêm alias: /raw/upload/.../file_abc.pdf
 * bằng cách rename cuối URL (nếu URL chưa có .pdf).
 */
function ensureExtInUrl(rawUrl: string, ext: string): string {
    if (!ext) return rawUrl;
    const cleanPath = rawUrl.split("?")[0].toLowerCase();
    if (cleanPath.endsWith(`.${ext}`)) return rawUrl; // đã có extension rồi
    // Cloudinary raw: append extension alias
    if (rawUrl.includes("res.cloudinary.com") && rawUrl.includes("/raw/upload/")) {
        const [base, query] = rawUrl.split("?");
        return query ? `${base}.${ext}?${query}` : `${base}.${ext}`;
    }
    return rawUrl;
}

/* ─── Component ───────────────────────────────────── */

const CVPreviewModal = ({ url, visible, onClose }: CVPreviewModalProps) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState(false);

    // Reset trạng thái khi URL thay đổi
    useEffect(() => {
        setIframeLoaded(false);
        setIframeError(false);
    }, [url, visible]);

    if (!url) return null;

    const ext = getExt(url);
    const isPdf = ext === "pdf";
    const isDocx = ext === "docx" || ext === "doc";

    // URL chuẩn hoá (đảm bảo có extension để viewer nhận dạng)
    const viewUrl = ensureExtInUrl(url, ext);
    const downloadUrl = buildDownloadUrl(url);

    // Chọn viewer:
    // - PDF  → PDF.js (Mozilla CDN) — không phụ thuộc Google, render offline-capable
    // - DOCX → Office Online Viewer (Microsoft)
    // - Khác → Office Online fallback
    let embedSrc: string;
    if (isPdf) {
        embedSrc = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(viewUrl)}`;
    } else if (isDocx) {
        embedSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewUrl)}`;
    } else {
        embedSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewUrl)}`;
    }

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download>
                    <Button type="primary" icon={<DownloadOutlined />}>
                        Tải xuống
                    </Button>
                </a>
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
                {/* Loading spinner */}
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

                {/* Error state */}
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
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button type="primary" icon={<DownloadOutlined />}>
                                Tải xuống ngay
                            </Button>
                        </a>
                    </div>
                )}

                <iframe
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
