"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../../components/ui/select";
import { useState } from "react";

const scheduleSchema = z.object({
  activityId: z.string().min(1, "Activity ID is required"),
  scheduledDate: z.date().refine((date) => date >= new Date(), {
    message: "Scheduled date must be in the future.",
  }),
  newActivity: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const activities = [
  { id: "activity-1", name: "Activity 1" },
  { id: "activity-2", name: "Activity 2" },
  { id: "activity-3", name: "Activity 3" },
  // Add more activities as needed
];

const ScheduleFormPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showNewActivityInput, setShowNewActivityInput] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      activityId: "",
      scheduledDate: new Date(),
      newActivity: "",
    },
  });

  const onSubmit = (data: ScheduleFormValues) => {
    console.log("New Schedule:", data);
    form.reset();
    setShowNewActivityInput(false);
  };

  const handleActivitySelect = (value: string) => {
    if (value === "new-activity") {
      setShowNewActivityInput(true);
    } else {
      setShowNewActivityInput(false);
      form.setValue("activityId", value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create New Schedule
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Activity Select */}
          <Select
            onValueChange={(value) => handleActivitySelect(value)}
            defaultValue={form.getValues("activityId")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an Activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.name}
                </SelectItem>
              ))}
              <SelectItem value="new-activity">Add New Activity</SelectItem>
            </SelectContent>
          </Select>

          {/* New Activity Input */}
          {showNewActivityInput && (
            <Input
              placeholder="Enter New Activity Name"
              {...form.register("newActivity")}
            />
          )}

          {/* Date Input */}
          <Input
            type="date"
            className="w-full"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              form.setValue("scheduledDate", new Date(e.target.value));
            }}
          />

          <Button className="w-full" type="submit">
            Save Schedule
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleFormPage;
