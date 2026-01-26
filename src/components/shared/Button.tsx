import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";

interface ButtonProps {
    id?: string;
    title: string;
    isLoading?: boolean;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    containerClass?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    href?: string;
    variant?: "primary" | "secondary";
    size?: "sm" | "md";
    type?: "button" | "submit";
    disabled?: boolean;
    ariaLabel?: string;
}

const Button = ({
    id,
    title,
    rightIcon,
    leftIcon,
    containerClass,
    onClick,
    href,
    isLoading,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    ariaLabel,
}: ButtonProps) => {
    const sizeClass = size === "sm" ? "px-4! py-2!" : "px-7! py-3!";
    const variantClass =
        variant === "secondary"
            ? "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            : "bg-primary text-white";

    return (
        <>
            {href ? (
                <Link to={href}>
                    <button
                        id={id}
                        type={type}
                        aria-label={ariaLabel}
                        disabled={disabled}
                        onClick={(e) => onClick?.(e)}
                        className={clsx(
                            "flex flex-row items-center justify-center gap-2 group relative z-10 w-fit overflow-hidden rounded-full font-general text-xs uppercase",
                            sizeClass,
                            variantClass,
                            disabled || isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer",
                            containerClass
                        )}
                    >
                        {leftIcon}
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader className="animate-spin"></Loader>
                            </span>
                        ) : (
                            <span className="relative inline-flex overflow-hidden">
                                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                                    {title}
                                </div>
                                <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                                    {title}
                                </div>
                            </span>
                        )}{" "}
                        {rightIcon}
                    </button>
                </Link>
            ) : (
                <button
                    id={id}
                    type={type}
                    aria-label={ariaLabel}
                    disabled={disabled || isLoading}
                    onClick={(e) => onClick?.(e)}
                    className={clsx(
                        "flex flex-row items-center justify-center gap-2 group relative z-10 w-fit overflow-hidden rounded-full font-general text-xs uppercase",
                        sizeClass,
                        variantClass,
                        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                        containerClass
                    )}
                >
                    {leftIcon}

                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader className="animate-spin"></Loader>
                        </span>
                    ) : (
                        <span className="relative inline-flex overflow-hidden">
                            <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                                {title}
                            </div>
                            <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                                {title}
                            </div>
                        </span>
                    )}

                    {rightIcon}
                </button>
            )}
        </>
    );
};

export default Button;