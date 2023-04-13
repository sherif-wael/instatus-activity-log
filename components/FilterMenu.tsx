import React, { useState, useRef, useEffect } from "react";
import { Filter } from "./icons";
import useSWR from "swr";
import { ListFilterOptionsReturn } from "@/lib/services/list-filter-options";
import { fetcher } from "@/lib/utils";

interface FilterMenuProps {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
}

const filters = [
    { key: "action_id", label: "Action", options: "actions" },
    { key: "actor_id", label: "Actor", options: "actors" },
    { key: "target_id", label: "Target", options: "targets" },
];

function FilterMenu(props: FilterMenuProps) {
    const [isOpened, setIsOpened] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { data } = useSWR<ListFilterOptionsReturn>(
        "/api/filter-options",
        fetcher
    );

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        const values = Object.fromEntries(
            new FormData(e.target as HTMLFormElement)
        ) as Record<string, string>;
        props.onChange(values);
        setIsOpened(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpened(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex relative" ref={menuRef}>
            <button
                onClick={() => setIsOpened(!isOpened)}
                className="flex space-x-2 items-center px-6 text-xs text-[#575757] border border-[#E0E0DF] border-l-0 transition-all hover:bg-gray-200 uppercase"
            >
                <Filter />
                <span>Filter</span>
            </button>

            {isOpened ? (
                <div className="absolute bg-white shadow-lg rounded-lg border border-[#F0f0f0] w-[300px] top-12 right-0 z-10 min-w-[120px] py-4">
                    <form onSubmit={handleSubmit}>
                        {filters.map((filter) => {
                            const options =
                                data?.[filter.options as keyof typeof data] ||
                                [];

                            return (
                                <div
                                    key={filter.key}
                                    className="px-4 py-3 flex flex-col"
                                >
                                    <label
                                        className="text-[#929292] text-xs font-medium mb-2"
                                        htmlFor={filter.key}
                                    >
                                        {filter.label}
                                    </label>

                                    <select
                                        id={filter.key}
                                        name={filter.key}
                                        defaultValue={props.value[filter.key]}
                                        className="text-gray-500 w-full bg-transparent text-sm border min-h-[32px] rounded-md px-3 border-[#E0E0DF] focus:outline-none focus:border-gray-400"
                                        placeholder="Select"
                                    >
                                        <option value="">
                                            Select an option
                                        </option>

                                        {options.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                                selected={
                                                    !!props.value[filter.key]
                                                }
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}

                        <div className="px-4 mt-2 flex space-x-2">
                            <button className="bg-gray-700 w-full text-white rounded-lg min-h-[32px] hover:bg-gray-800 font-semibold uppercase text-sm">
                                Save
                            </button>

                            <button
                                onClick={() => props.onChange?.({})}
                                className="bg-transparent w-full text-gray-700 rounded-lg min-h-[32px] border border-gray-700 hover:bg-gray-100 font-semibold uppercase text-sm"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
}

export default FilterMenu;
