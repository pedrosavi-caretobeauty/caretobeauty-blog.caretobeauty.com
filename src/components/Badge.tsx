import Link from "next/link";

type BadgeVariant = "default" | "salmon" | "menthol" | "blue" | "outline";

interface BadgeProps {
  label: string;
  href?: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-brown-50 text-brown-700",
  salmon: "bg-salmon-200 text-brown-700",
  menthol: "bg-menthol-100 text-brown-700",
  blue: "bg-blue-200 text-brown-700",
  outline: "border border-brown-200 text-brown-700",
};

export function Badge({ label, href, variant = "default", size = "sm" }: BadgeProps) {
  const classes = `inline-block rounded-full font-semibold uppercase tracking-wide ${
    size === "sm" ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs"
  } ${variantClasses[variant]}`;

  if (href) {
    return (
      <Link href={href} className={`${classes} transition-opacity hover:opacity-80`}>
        {label}
      </Link>
    );
  }

  return <span className={classes}>{label}</span>;
}
