import { useState } from "react";

export function ProductPhoto({
  src,
  alt,
  label,
  className = "",
  imageClassName = "",
  "data-testid": testId,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
  imageClassName?: string;
  "data-testid"?: string;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-[#2D2D2F] ${className}`} role="img" aria-label={alt} data-testid={testId}>
      {failed ? (
        <div className="grid h-full min-h-24 w-full place-items-center bg-[#2D2D2F] p-4 text-center text-[14px] font-medium text-white">
          {label}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      )}
    </div>
  );
}
