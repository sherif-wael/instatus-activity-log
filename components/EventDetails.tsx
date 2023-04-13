import { Event } from "@/lib/types";
import dayjs from "dayjs";
import { Close } from "./icons";

interface EventDetailsProps {
    event: Event;
    onCollapse: () => void;
}

interface EventDetailsSectionProps {
    title: string;
    data: {
        label: string;
        value: string;
    }[];
}

function EventDetailsSection(props: EventDetailsSectionProps) {
    return (
        <div>
            <div className="text-[#929292] font-medium mb-4">{props.title}</div>

            <div className="space-y-3">
                {props.data.map((item) => {
                    return (
                        <div
                            className="flex items-center space-x-2"
                            key={item.label.toLowerCase()}
                        >
                            <div className="text-[#929292] w-1/4">
                                {item.label}
                            </div>
                            <div>{item.value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EventDetails(props: EventDetailsProps) {
    return (
        <div className="relative grid grid-cols-3 gap-y-8 gap-x-6 text-sm bg-white border border-[#DFDFDF] shadow-sm rounded-xl py-8 px-10 -mx-8">
            <button
                className="absolute right-4 top-4 text-gray-500 w-6 h-6 flex items-center justify-center transition-all hover:bg-gray-50"
                onClick={props.onCollapse}
            >
                <Close />
            </button>

            <EventDetailsSection
                title="ACTOR"
                data={[
                    { label: "Name", value: props.event.actor_name },
                    { label: "Email", value: props.event.actor_email },
                    { label: "ID", value: props.event.actor_id },
                ]}
            />

            <EventDetailsSection
                title="ACTION"
                data={[
                    { label: "Name", value: props.event.action.name },
                    { label: "Object", value: props.event.action.object },
                    { label: "ID", value: props.event.action.id.toString() },
                ]}
            />

            <EventDetailsSection
                title="DATE"
                data={[
                    {
                        label: "Readable",
                        value: dayjs(props.event.created_at).format(
                            "MMM D, hh:mm A"
                        ),
                    },
                ]}
            />

            {props.event.metadata ? (
                <EventDetailsSection
                    title="METADATA"
                    data={Object.entries(props.event.metadata).map(
                        ([key, value]) => {
                            return { label: key, value: value.toString() };
                        }
                    )}
                />
            ) : null}

            <EventDetailsSection
                title="TARGET"
                data={[
                    { label: "Name", value: props.event.target_name },
                    { label: "ID", value: props.event.target_id },
                ]}
            />
        </div>
    );
}

export default EventDetails;
