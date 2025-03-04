"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface Notification {
    notificationMessage: string;
}

const SchedulePage = () => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/dashboard");
                if (!response.ok) throw new Error("Failed to fetch notifications");

                const result = await response.json();
                setNotifications(result.notifications || []);
                setShowDialog(result.notifications.length > 0);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

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

    const handleDialogClose = () => setShowDialog(false);

    return (
        <>
            <style jsx global>{`
                .fc .fc-prevMonth-button,
                .fc .fc-nextMonth-button {
                    font-size: 18px !important;
                    background: #33b76d !important;
                }
            `}</style>
            <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">

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


                {showDialog && (
                    <AlertDialog open={showDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-bold mt-10">
                                    Scheduled Notifications
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="text-sm text-muted-foreground">
                                <ol className="space-y-2">
                                    {notifications.map((notification, index) => (
                                        <li key={index}> ➞ {notification.notificationMessage}</li>
                                    ))}
                                </ol>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleDialogClose}>CLOSE</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

            </div>
        </>
    );
};

export default SchedulePage;
