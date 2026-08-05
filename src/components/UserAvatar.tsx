import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  /** Profile image URL from the backend. Empty / null → default icon. */
  src?: string | null;
  alt?: string;
  className?: string;
  /** Pixel size classes for the outer circle (default matches navbar). */
  sizeClassName?: string;
  iconClassName?: string;
}

/**
 * Shows the user's uploaded photo when available; otherwise a neutral
 * profile icon (never the old stock profile.png photo).
 */
export function UserAvatar({
  src,
  alt = "User",
  className,
  sizeClassName = "h-9 w-9",
  iconClassName = "h-5 w-5",
}: UserAvatarProps) {
  const photo = typeof src === "string" ? src.trim() : "";

  if (photo) {
    return (
      <img
        src={photo}
        alt={alt}
        className={cn(
          "rounded-full bg-gray-100 object-cover",
          sizeClassName,
          className,
        )}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#e8f0eb] text-[#2C6E49]",
        sizeClassName,
        className,
      )}
    >
      <User className={iconClassName} strokeWidth={2} />
    </span>
  );
}
