import { useEffect, useState } from "react";
import { resolvePhotoUrl } from "../../../utils/photoUrl";

// 1 ô ảnh vào ca / ra ca: thumbnail (bấm xem to) + badge Có/Không.
// Ảnh lỗi (404) tự downgrade về "Không" để bảng vẫn đọc được.
const PhotoCell = ({ src, alt }) => {
    const url = resolvePhotoUrl(src);
    const [broken, setBroken] = useState(false);

    useEffect(() => setBroken(false), [src]);

    const show = url && !broken;
    return (
        <div className="att-photo-cell">
            {show ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    title={`Xem ảnh ${alt}`}
                >
                    <img
                        src={url}
                        alt={alt}
                        className="att-photo-thumb"
                        onError={() => setBroken(true)}
                    />
                </a>
            ) : null}
            <span className={`att-badge ${show ? "ok" : "bad"}`}>
                {show ? "Có" : "Không"}
            </span>
        </div>
    );
};

export default PhotoCell;
