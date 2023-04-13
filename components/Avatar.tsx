import clsx from "clsx";

interface AvatarProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    name: string;
}

function Avatar(props: AvatarProps) {
    const { size = "md", name, className } = props;

    return (
        <div
            className={clsx(
                "rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                {
                    "w-6 h-6": size === "sm",
                    "w-8 h-8": size === "md",
                    "w-10 h-10": size === "lg",
                },
                className
            )}
        >
            <span className="text-white text-xs font-bold uppercase">
                {name[0]}
            </span>
        </div>
    );
}

export default Avatar;