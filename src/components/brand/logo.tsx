import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-8", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="url(#sb-grad)" />
      <path
        d="M10.5 20.5V14.2c0-.5.28-.96.72-1.2l4.06-2.2a1.4 1.4 0 0 1 1.36 0l4.06 2.2c.44.24.72.7.72 1.2v6.3"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3 21.2v-4.06c0-.72.78-1.17 1.4-.8l2.4 1.4c.6.35.6 1.23 0 1.58"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.4" cy="21.4" r="2.1" fill="white" fillOpacity="0.92" />
      <defs>
        <linearGradient id="sb-grad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
  subtitle,
}: {
  className?: string;
  showText?: boolean;
  subtitle?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-[0.95rem] font-semibold tracking-tight">
            SupportBrain <span className="text-primary">AI</span>
          </span>
          {subtitle && (
            <span className="mt-0.5 text-[0.7rem] font-medium text-muted-foreground">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
