/**
 * CVPreviewModal — shared component dùng ở cả admin và client
 *
 * ✅ Chiến lược xem (ĐÃ SỬA):
 *  - PDF  → render TRỰC TIẾP trong trình duyệt (Chrome/Firefox/Edge/Safari đều hỗ trợ)
 *           KHÔNG dùng Google Docs Viewer nữa — viewer đó hay lỗi với Cloudinary URL
 *  - DOCX → Office Online Viewer (Microsoft) + timeout fallback 30s
 *
 * ✅ Tại sao Google Docs Viewer bị lỗi?
 *  - Google fetch file từ Cloudinary nhưng bị chặn/rate-limit không ổn định
 *  - Khi viewer thất bại, iframe vẫn trả HTTP 200 → onError KHÔNG bao giờ fire
 *  - Người dùng thấy màn hình trắng / spinner kẹt mãi
 *
 * ✅ Chiến lược tải:
 *  - Dùng fetch + Blob để tải cross-origin, đảm bảo file có đúng tên + extension
 */

import { Button, Modal, Spin } from "antd";
import { FileTextOutlined, DownloadOutlined, WarningOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";

interface CVPreviewModalProps {
    url: string;
    visible: boolean;
    onClose: () => void;
}

/* ─── Helpers ─────────────────────────────────────── */

function getExt(url: string): string {
    const clean = url.split("?")[0].toLowerCase();
    const match = clean.match(/\.(pdf|docx|doc)(?=$|[^a-z])/);
    return match ? match[1] : "";
}

function getFilename(url: string): string {
    const clean = url.split("?")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || "cv-file";
}

async function downloadFile(url: string): Promise<void> {
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Fetch failed");
        const blob = await resp.blob();

        let filename = getFilename(url);
        const ext = getExt(url);

        if (ext && !filename.toLowerCase().endsWith(`.${ext}`)) {
            filename = `${filename}.${ext}`;
        }

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
        window.open(url, "_blank");
    }
}

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

const OFFICE_ONLINE_TIMEOUT_MS = 30_000;

const CVPreviewModal = ({ url, visible, onClose }: CVPreviewModalProps) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setIframeLoaded(false);
        setIframeError(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (!visible || !url) return;

        const ext = getExt(url);
        const isDocxFile = ext === "docx" || ext === "doc";

        // Chỉ cần timeout cho Office Online (DOCX).
        // PDF render trực tiếp nên onLoad/onError đủ tin cậy.
        if (isDocxFile) {
            timeoutRef.current = setTimeout(() => {
                setIframeLoaded((loaded) => {
                    if (!loaded) setIframeError(true);
                    return loaded;
                });
            }, OFFICE_ONLINE_TIMEOUT_MS);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [url, visible]);

    if (!url) return null;

    const ext = getExt(url);
    const isPdf = ext === "pdf";
    const isDocx = ext === "docx" || ext === "doc";
    const viewUrl = ensureExtInUrl(url, ext);

    /**
     * ✅ FIX CHÍNH:
     *  PDF  → URL trực tiếp (browser native rendering — KHÔNG dùng Google Docs Viewer)
     *  DOCX → Office Online (đáng tin cậy hơn)
     */
    let embedSrc: string;
    if (isPdf) {
        embedSrc = viewUrl;
    } else if (isDocx) {
        embedSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewUrl)}`;
    } else {
        embedSrc = viewUrl;
    }

    const handleLoad = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIframeLoaded(true);
    };

    const handleError = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIframeError(true);
    };

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
                        <span style={{ color: "#64748b", fontSize: 14 }}>
                            {isDocx ? "Đang tải CV qua Office Online..." : "Đang tải CV..."}
                        </span>
                        {isDocx && (
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                File Word có thể mất vài giây để xử lý
                            </span>
                        )}
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
                    onLoad={handleLoad}
                    onError={handleError}
                />
            </div>
        </Modal>
    );
};

export default CVPreviewModal;
