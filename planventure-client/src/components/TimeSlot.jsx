import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function TimeSlot({ timeSlot, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    time: dayjs(timeSlot.time, "HH:mm"),
    activity: timeSlot.activity,
    location: timeSlot.location || "",
    notes: timeSlot.notes || "",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      time: dayjs(timeSlot.time, "HH:mm"),
      activity: timeSlot.activity,
      location: timeSlot.location || "",
      notes: timeSlot.notes || "",
    });
  };

  const handleSave = () => {
    onUpdate({
      ...timeSlot,
      time: editData.time.format("HH:mm"),
      activity: editData.activity,
      location: editData.location,
      notes: editData.notes,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      onDelete(timeSlot.id);
    }
  };

  if (isEditing) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ mb: 2, border: "2px solid", borderColor: "primary.main" }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TimePicker
                label="Time"
                value={editData.time}
                onChange={(newValue) =>
                  setEditData({ ...editData, time: newValue })
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
              />

              <TextField
                label="Activity"
                value={editData.activity}
                onChange={(e) =>
                  setEditData({ ...editData, activity: e.target.value })
                }
                size="small"
                fullWidth
                required
              />

              <TextField
                label="Location"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                size="small"
                fullWidth
              />

              <TextField
                label="Notes"
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                size="small"
                fullWidth
                multiline
                rows={2}
              />

              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!editData.activity.trim()}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </LocalizationProvider>
    );
  }

  return (
    <Card sx={{ mb: 2, "&:hover": { boxShadow: 3 } }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TimeIcon sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
              <Typography variant="h6" component="div">
                {dayjs(timeSlot.time, "HH:mm").format("h:mm A")}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {timeSlot.activity}
            </Typography>

            {timeSlot.location && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationIcon
                  sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {timeSlot.location}
                </Typography>
              </Box>
            )}

            {timeSlot.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {timeSlot.notes}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton size="small" onClick={handleEdit} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
