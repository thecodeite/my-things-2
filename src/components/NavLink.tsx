import { cn } from "@/lib/utils";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavLinkProps extends LinkProps {
  direction: "back" | "forward";
  className?: string;
}

export function NavLink({
  direction,
  children,
  className,
  ...props
}: NavLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        className,
        "text-blue-500 hover:underline mb-4 flex items-center",
        direction === "back" ? "justify-start" : "justify-end",
      )}
    >
      {direction === "back" ? (
        <>
          <ChevronLeft className="size-4" /> {children}
        </>
      ) : (
        <>
          {children} <ChevronRight className="size-4" />
        </>
      )}
    </Link>
  );
}
