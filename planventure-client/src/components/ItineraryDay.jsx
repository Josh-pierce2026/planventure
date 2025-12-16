import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TimeSlot from "./TimeSlot";

export default function ItineraryDay({
  day,
  timeSlots = [],
  onAddTimeSlot,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
}) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    time: dayjs().hour(9).minute(0),
    activity: "",
    location: "",
    notes: "",
  });

  const handleAddActivity = () => {
    if (newActivity.activity.trim()) {
      onAddTimeSlot({
        dayId: day.id,
        time: newActivity.time.format("HH:mm"),
        activity: newActivity.activity,
        location: newActivity.location,
        notes: newActivity.notes,
      });
      setNewActivity({
        time: dayjs().hour(9).minute(0),
        activity: "",
        location: "",
        notes: "",
      });
      setIsAddingActivity(false);
    }
  };

  const sortedTimeSlots = [...timeSlots].sort((a, b) => {
    return dayjs(a.time, "HH:mm").diff(dayjs(b.time, "HH:mm"));
  });

  return (
    <Accordion defaultExpanded sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarIcon color="primary" />
          <Typography variant="h6">
            Day {day.dayNumber} - {dayjs(day.date).format("MMMM D, YYYY")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            ({sortedTimeSlots.length}{" "}
            {sortedTimeSlots.length === 1 ? "activity" : "activities"})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {sortedTimeSlots.length === 0 && !isAddingActivity && (
            <Typography
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center", py: 2 }}
            >
              No activities planned yet. Add your first activity!
            </Typography>
          )}

          {sortedTimeSlots.map((timeSlot) => (
            <TimeSlot
              key={timeSlot.id}
              timeSlot={timeSlot}
              onUpdate={onUpdateTimeSlot}
              onDelete={onDeleteTimeSlot}
            />
          ))}

          {isAddingActivity && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  New Activity
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <TimePicker
                    label="Time"
                    value={newActivity.time}
                    onChange={(newValue) =>
                      setNewActivity({ ...newActivity, time: newValue })
                    }
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />

                  <TextField
                    label="Activity"
                    value={newActivity.activity}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        activity: e.target.value,
                      })
                    }
                    size="small"
                    fullWidth
                    required
                  />

                  <TextField
                    label="Location"
                    value={newActivity.location}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        location: e.target.value,
                      })
                    }
                    size="small"
                    fullWidth
                  />

                  <TextField
                    label="Notes"
                    value={newActivity.notes}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, notes: e.target.value })
                    }
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleAddActivity}
                      disabled={!newActivity.activity.trim()}
                    >
                      Add Activity
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsAddingActivity(false);
                        setNewActivity({
                          time: dayjs().hour(9).minute(0),
                          activity: "",
                          location: "",
                          notes: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </LocalizationProvider>
          )}

          {!isAddingActivity && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingActivity(true)}
              fullWidth
            >
              Add Activity
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
