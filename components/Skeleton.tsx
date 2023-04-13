import clsx from "clsx";

interface SkeletonProps {
    className?: string;
}

export function AvatarSkeleton(props: SkeletonProps) {
    return (
        <div className={clsx("animate-pulse", props.className)}>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        </div>
    );
}

export function TextSkeleton(props: SkeletonProps) {
    return (
        <div className={clsx("animate-pulse w-full", props.className)}>
            <div className="rounded-sm h-[14px] bg-gray-200"></div>
        </div>
    );
}
