import type { SVGProps } from "react";

export default function FacebookIcon({
  strokeWidth = 1.5,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M14 8.5h-1.2c-.9 0-1.3.5-1.3 1.4V12h2.4l-.3 2.5h-2.1V20" />
    </svg>
  );
}