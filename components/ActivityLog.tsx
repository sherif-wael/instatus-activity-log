import { fetcher } from "@/lib/utils";
import useSWRInfinite from "swr/infinite";
import { AvatarSkeleton, TextSkeleton } from "./Skeleton";
import { ListEventsReturn } from "@/lib/services/list-events";
import Avatar from "./Avatar";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { ChevronRight, Download } from "./icons";
import debounce from "lodash.debounce";
import EventDetails from "./EventDetails";
import clsx from "clsx";
import FilterMenu from "./FilterMenu";

const PAGE_SIZE = 10;

function ActivityLogSkeleton() {
    return (
        <>
            {Array.from({ length: PAGE_SIZE }).map((_, index) => {
                return (
                    <div className="grid grid-cols-3 px-2 py-4" key={index}>
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
    const [isLive, setIsLive] = useState(false);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

    const { data, isLoading, setSize, size } = useSWRInfinite<ListEventsReturn>(
        (index) => {
            const filtersString = Object.entries(filters)
                .reduce<string[]>((acc, [key, value]) => {
                    if (value) acc.push(`${key}=${value}`);
                    return acc;
                }, [])
                .join("&");

            const qs =
                `page=${index + 1}&limit=${PAGE_SIZE}` +
                (search ? `&search=${search}` : "") +
                (filtersString ? `&${filtersString}` : "");
            return `/api/events?${qs}`;
        },
        fetcher,
        {
            refreshInterval: isLive ? 1000 : 0,
        }
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

    const handleFilter = (filters: Record<string, string>) => {
        setFilters(filters);
        setSize(1);
    }

    const handleToggleLive = () => setIsLive(!isLive);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearchHandler = useCallback(debounce(handleSearch, 300), []);

    useEffect(() => {
        return () => {
            debouncedSearchHandler.cancel();
        };
    }, [debouncedSearchHandler]);

    return (
        <div className="bg-white rounded-xl border border-[#F0f0f0] shadow-[0px_3px_5px_rgb(0, 0, 0, 0.2)]">
            <div className="bg-[#f5f5f5] p-4 rounded-t-xl mb-2">
                <div className="mb-4 flex">
                    <input
                        type="search"
                        className="w-full bg-transparent text-sm border min-h-[45px] rounded-l-lg px-3 border-[#E0E0DF] focus:outline-none focus:border-gray-400"
                        placeholder="Search name, email or action..."
                        defaultValue={search}
                        onChange={(e) => debouncedSearchHandler(e.target.value)}
                    />

                    <FilterMenu
                        value={filters}
                        onChange={handleFilter}
                    />

                    <a
                        className="flex items-center px-6 text-xs text-[#575757] border border-[#E0E0DF] border-l-0 hover:bg-gray-700 hover:text-white transition-all uppercase"
                        href="/api/downloads/events"
                        download
                    >
                        <span className="text-[16px] mr-1 -mt-0.5">
                            <Download />
                        </span>
                        Export
                    </a>

                    <button
                        onClick={handleToggleLive}
                        className="flex space-x-2 items-center px-6 text-xs text-[#575757] border border-[#E0E0DF] rounded-r-lg border-l-0 transition-all hover:bg-gray-200 uppercase"
                    >
                        <span
                            className={clsx(
                                "w-3 h-3 rounded-full",
                                isLive ? "bg-green-600" : "bg-[#8F485D]"
                            )}
                        ></span>
                        <span>{isLive ? "Cancel" : "Live"}</span>
                    </button>
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
                                            key={event.id}
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
