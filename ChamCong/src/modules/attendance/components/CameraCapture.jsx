import { useRef, useState, useEffect } from "react";

// Chụp ảnh qua webcam theo phong cách marixa:
// - Chờ: nút "Chụp ảnh" to viền chấm
// - Bật: preview video + nút "Chụp"
// - Chụp xong: xem trước ảnh + "Xóa" và "Chụp lại"
// Prop `locked`: ảnh đã sẵn sàng cho lần chấm công -> khóa 2 nút.
const CameraCapture = ({ onPhoto, locked }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const detectorRef = useRef(null);
    const mountedRef = useRef(true);
    const [opening, setOpening] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [faceReady, setFaceReady] = useState(false);
    const [faceMessage, setFaceMessage] = useState("Đang tải kiểm tra khuôn mặt…");
    const [active, setActive] = useState(false);
    const [error, setError] = useState("");
    const [shot, setShot] = useState(null);
    const [shotUrl, setShotUrl] = useState("");
    useEffect(() => {
        if (!shot) { setShotUrl(""); return; }
        const url = URL.createObjectURL(shot);
        setShotUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [shot]);

    // Dừng camera khi rời trang
    useEffect(
        () => {
            mountedRef.current = true;
            return () => {
                mountedRef.current = false;
                streamRef.current?.getTracks().forEach((t) => t.stop());
            };
        },
        []
    );

    // Gán stream vào thẻ video (bắt buộc, thiếu dòng này sẽ chỉ hiện khung đen)
    useEffect(() => {
        if (active && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [active]);

    const checkFace = (image, width, height) => {
        const result = detectorRef.current.detectForVideo(image, performance.now());
        const faces = result.detections;
        if (faces.length !== 1) return faces.length ? "Có nhiều khuôn mặt. Chỉ một người đứng trước camera." : "Chưa thấy khuôn mặt. Nhìn vào camera và chọn nơi đủ sáng.";
        const box = faces[0].boundingBox;
        if (!box || box.width < width * 0.15 || box.height < height * 0.15) return "Hãy đưa khuôn mặt gần camera hơn.";
        if (box.originX < 0 || box.originY < 0 || box.originX + box.width > width || box.originY + box.height > height) return "Hãy đưa toàn bộ khuôn mặt vào khung hình.";
        return "";
    };

    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        let timer;
        let detector;
        let lastTime = -1;
        setFaceReady(false);
        setFaceMessage("Đang tải kiểm tra khuôn mặt…");
        const init = async () => {
            try {
                const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");
                const files = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm");
                if (cancelled) return;
                detector = await FaceDetector.createFromOptions(files, {
                    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite" },
                    runningMode: "VIDEO",
                    minDetectionConfidence: 0.7,
                });
                if (cancelled) { detector.close(); return; }
                detectorRef.current = detector;
                const scan = () => {
                    if (cancelled) return;
                    const video = videoRef.current;
                    try {
                        if (video?.readyState >= 2 && video.currentTime !== lastTime) {
                            lastTime = video.currentTime;
                            const message = checkFace(video, video.videoWidth, video.videoHeight);
                            setFaceReady(!message);
                            setFaceMessage(message || "Đã thấy một khuôn mặt. Bạn có thể chụp ảnh.");
                        }
                        timer = window.setTimeout(scan, 300);
                    } catch {
                        setFaceReady(false);
                        setFaceMessage("Không kiểm tra được khuôn mặt. Đóng camera rồi mở lại.");
                    }
                };
                scan();
            } catch {
                if (!cancelled) {
                    setFaceReady(false);
                    setFaceMessage("Không tải được kiểm tra khuôn mặt. Kiểm tra mạng rồi mở lại camera.");
                }
            }
        };
        init();
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            if (detectorRef.current === detector) detectorRef.current = null;
            detector?.close();
        };
    }, [active]);

    const stop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setActive(false);
    };

    const start = async () => {
        if (opening || locked) return;
        setOpening(true);
        try {
            setError("");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "user" },
            });
            if (!mountedRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
            streamRef.current = stream;
            // srcObject được gán trong useEffect khi thẻ video mount
            setActive(true);
        } catch {
            setError("Không truy cập được camera. Hãy cấp quyền và thử lại.");
        } finally {
            if (mountedRef.current) setOpening(false);
        }
    };

    const capture = () => {
        if (locked || capturing || !faceReady || !detectorRef.current) return;
        const video = videoRef.current;
        if (!video || !video.videoWidth) {
            setError("Camera chưa sẵn sàng. Vui lòng thử lại.");
            return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const capturedAt = new Date().toISOString();
        try {
            const message = checkFace(canvas, canvas.width, canvas.height);
            if (message) { setFaceReady(false); setFaceMessage(message); return; }
        } catch {
            setFaceReady(false);
            setError("Không kiểm tra được ảnh. Đóng camera rồi mở lại.");
            return;
        }
        setCapturing(true);
        canvas.toBlob(
            (blob) => {
                if (!mountedRef.current) return;
                setCapturing(false);
                if (!blob) {
                    setError("Không chụp được ảnh.");
                    return;
                }
                const photo = new File([blob], "attendance-photo.jpg", {
                    type: "image/jpeg",
                });
                setShot(photo);
                onPhoto?.(photo, capturedAt);
                stop();
            },
            "image/jpeg",
            0.85
        );
    };

    // Xóa ảnh: bỏ ảnh vừa chụp, không gửi kèm khi vào/ra ca
    const remove = () => {
        setShot(null);
        onPhoto?.(null);
    };

    // Chụp lại: xóa ảnh cũ rồi mở camera
    const retake = () => {
        remove();
        start();
    };

    if (shot) {
        return (
            <div className="att-cam-done">
                <img
                    key={shot.name}
                    src={shotUrl}
                    alt="Ảnh đã chụp"
                />
                <div>
                    <strong>Ảnh vừa chụp</strong>
                    <span className="att-muted">
                        {locked
                            ? "Ảnh sẽ được gửi kèm khi bạn nhấn chấm công."
                            : "Sẽ gửi kèm khi bạn nhấn Vào ca / Ra ca."}
                    </span>
                    <div className="att-cam-done-actions">
                        <button
                            type="button"
                            className="att-cam-btn-remove"
                            onClick={remove}
                            disabled={locked}
                        >
                            Xóa
                        </button>
                        <button
                            type="button"
                            onClick={retake}
                            disabled={locked}
                        >
                            Chụp lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (active) {
        return (
            <div className="att-cam">
                <video ref={videoRef} autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} />
                <p className={faceReady ? "att-checkin-done" : "att-muted"} role="status" aria-live="polite">{faceMessage}</p>
                <button type="button" onClick={capture} disabled={!faceReady || capturing || locked}>
                    {capturing ? "Đang chụp…" : "Chụp"}
                </button>
                <button type="button" onClick={stop} disabled={capturing}>Đóng camera</button>
                {error && <p className="att-cam-error">{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className="att-cam-idle">
                <button type="button" onClick={start} disabled={opening || locked}>
                    {opening ? "Đang mở camera…" : "📷 Chụp ảnh"}
                </button>
            </div>
            {error && <p className="att-cam-error">{error}</p>}
        </div>
    );
};

export default CameraCapture;
