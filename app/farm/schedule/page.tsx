"use client";

import { Card } from '../../../components/ui/card';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';

const SchedulePage = () => {
    const [events, setEvents] = useState<any[]>([
        // Example event data (You can fetch actual data from your backend)
        { id: '1', title: 'Sample Activity', start: new Date().toISOString() },
    ]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Scheduled Activities</h1>
            <Card className="w-full max-w-3xl p-4 shadow-none">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    selectable={true}
                    height="auto"
                />
            </Card>
        </div>
    );
};

export default SchedulePage;
