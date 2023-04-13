import { fetcher } from "@/lib/utils";
import useSWRInfinite from "swr/infinite";
import { AvatarSkeleton, TextSkeleton } from "./Skeleton";
import { ListEventsReturn } from "@/lib/services/list-events";
import Avatar from "./Avatar";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { ChevronRight } from "./icons";
import debounce from "lodash.debounce";
import EventDetails from "./EventDetails";

const PAGE_SIZE = 10;

function ActivityLogSkeleton() {
    return (
        <>
            {Array.from({ length: PAGE_SIZE }).map((_, index) => {
                return (
                    <div className="grid grid-cols-3 py-4" key={index}>
                        <div className="flex items-center space-x-3">
                            <AvatarSkeleton />
                            <TextSkeleton className="max-w-[132px]" />
                        </div>

                        <div>
                            <TextSkeleton className="max-w-[188px]" />
                        </div>

                        <div>
                            <TextSkeleton className="max-w-[100px]" />
                        </div>
                    </div>
                );
            })}
        </>
    );
}

function ActivityLog() {
    const [search, setSearch] = useState("");

    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

    const { data, isLoading, setSize, size } = useSWRInfinite<ListEventsReturn>(
        (index) => {
            const qs =
                `page=${index + 1}&limit=${PAGE_SIZE}` +
                (search ? `&search=${search}` : "");
            return `/api/events?${qs}`;
        },
        fetcher
    );

    const isLoadingMore =
        isLoading ||
        (size > 0 && data && typeof data[size - 1] === "undefined");

    const isReachingEnd = data && !data[data.length - 1].has_more;

    const isEmpty = data && data.length === 1 && data[0].events.length === 0;

    const handleLoadMore = () => setSize(size + 1);

    const handleSearch = (value: string) => {
        setSearch(value);
        setSize(1);
    };

    const debouncedSearchHandler = useCallback(debounce(handleSearch, 300), []);

    useEffect(() => {
        return () => {
            debouncedSearchHandler.cancel();
        };
    }, []);

    return (
        <div className="bg-white rounded-xl border border-[#F0f0f0] shadow-[0px_3px_5px_rgb(0, 0, 0, 0.2)]">
            <div className="bg-[#f5f5f5] p-4 rounded-t-xl mb-2">
                <div className="mb-4">
                    <input
                        type="search"
                        className="w-full bg-transparent border min-h-[45px] rounded-lg px-3 border-[#E0E0DF] focus:outline-none focus:border-gray-400"
                        placeholder="Search name, email or action..."
                        defaultValue={search}
                        onChange={(e) => debouncedSearchHandler(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-3">
                    <div className="text-sm font-semibold uppercase text-[#616161]">
                        actor
                    </div>
                    <div className="text-sm font-semibold uppercase text-[#616161]">
                        action
                    </div>
                    <div className="text-sm font-semibold uppercase text-[#616161]">
                        date
                    </div>
                </div>
            </div>

            <div className="px-2">
                {data?.map((page) => {
                    return (
                        <>
                            {page.events.map((event) => {
                                const isExpanded = event.id === expandedEventId;

                                if (isExpanded) {
                                    return (
                                        <EventDetails
                                            event={event}
                                            onCollapse={() =>
                                                setExpandedEventId(null)
                                            }
                                        />
                                    );
                                }

                                return (
                                    <div
                                        className="grid grid-cols-3 py-4 text-sm text-[#1C1C1C] rounded-xl border border-transparent hover:border-gray-100 hover:shadow-md cursor-pointer transition-all px-2 my-2"
                                        key={event.id}
                                        onClick={() =>
                                            setExpandedEventId(event.id)
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Avatar
                                                name={event.actor_name}
                                                size="sm"
                                            />
                                            <div>{event.actor_email}</div>
                                        </div>

                                        <div>{event.action.name}</div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                {dayjs(event.created_at).format(
                                                    "MMM D, hh:mm A"
                                                )}
                                            </div>

                                            <span className="text-gray-300 text-lg">
                                                <ChevronRight />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    );
                })}

                {isEmpty ? (
                    <div className="text-center text-gray-400 h-40 flex items-center justify-center">
                        No activity found
                    </div>
                ) : null}

                {isLoadingMore ? <ActivityLogSkeleton /> : null}
            </div>

            <button
                className="h-14 w-full flex items-center justify-center text-sm font-semibold text-[#616161] uppercase rounded-b-xl bg-[#f5f5f5] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                onClick={handleLoadMore}
                disabled={isReachingEnd}
            >
                Load More
            </button>
        </div>
    );
}

export default ActivityLog;
