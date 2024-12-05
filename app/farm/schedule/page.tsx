"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    color?: string;
    extendedProps?: {
        description: string;
    };
}

const SchedulePage = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        // Fetch schedules from the API
        const fetchSchedules = async () => {
            try {
                const response = await fetch('/api/schedules');
                const data = await response.json();

                if (data.success) {
                    // Truncate long titles and add primary color
                    const formattedEvents = data.events.map((event: CalendarEvent) => ({
                        ...event,
                        color: '#33b76d', // Primary color
                        title: event.title.length > 20
                            ? `${event.title.substring(0, 20)}...`
                            : event.title,
                        extendedProps: {
                            description: event.title // Save original title for tooltip
                        }
                    }));

                    setEvents(formattedEvents);
                } else {
                    console.error('Failed to fetch schedules:', data.message);
                }
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, []);

    return (
        <>
            <style jsx global>{`
                .fc .fc-prevMonth-button,
                .fc .fc-nextMonth-button {
                    font-size: 18px !important;
                    background: #33b76d !important;
                }
            `}</style>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">

                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    selectable={true}
                    height="auto"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay',
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                    }}
                    eventMouseEnter={(info) => {
                        // Custom tooltip logic
                        const event = info.event;
                        const extendedProps = event.extendedProps as CalendarEvent['extendedProps'];
                        info.el.setAttribute('title', extendedProps?.description || event.title);
                    }}
                />

                <h1 className="text-2xl font-bold mt-10 text-center">Scheduled Activities</h1>

            </div>
        </>
    );
};

export default SchedulePage;
