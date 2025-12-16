import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Chip,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Flight as FlightIcon,
  Train as TrainIcon,
  DirectionsCar as CarIcon,
  DirectionsBus as BusIcon,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const transportTypes = [
  { value: "flight", label: "Flight", icon: <FlightIcon /> },
  { value: "train", label: "Train", icon: <TrainIcon /> },
  { value: "car", label: "Car Rental", icon: <CarIcon /> },
  { value: "bus", label: "Bus", icon: <BusIcon /> },
  { value: "other", label: "Other", icon: null },
];

export default function TransportationCard({
  transportation,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    type: transportation.type,
    from: transportation.from,
    to: transportation.to,
    departureTime: dayjs(transportation.departure_time),
    arrivalTime: transportation.arrival_time
      ? dayjs(transportation.arrival_time)
      : null,
    confirmationNumber: transportation.confirmation_number || "",
    carrier: transportation.carrier || "",
    notes: transportation.notes || "",
  });

  const handleSave = () => {
    onUpdate({
      ...transportation,
      type: editData.type,
      from: editData.from,
      to: editData.to,
      departure_time: editData.departureTime.toISOString(),
      arrival_time: editData.arrivalTime
        ? editData.arrivalTime.toISOString()
        : null,
      confirmation_number: editData.confirmationNumber,
      carrier: editData.carrier,
      notes: editData.notes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      type: transportation.type,
      from: transportation.from,
      to: transportation.to,
      departureTime: dayjs(transportation.departure_time),
      arrivalTime: transportation.arrival_time
        ? dayjs(transportation.arrival_time)
        : null,
      confirmationNumber: transportation.confirmation_number || "",
      carrier: transportation.carrier || "",
      notes: transportation.notes || "",
    });
  };

  const getIcon = (type) => {
    const transport = transportTypes.find((t) => t.value === type);
    return transport?.icon || <CarIcon />;
  };

  if (isEditing) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ mb: 2, border: "2px solid", borderColor: "primary.main" }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                select
                label="Type"
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
                fullWidth
                required
              >
                {transportTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="From"
                value={editData.from}
                onChange={(e) =>
                  setEditData({ ...editData, from: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="To"
                value={editData.to}
                onChange={(e) =>
                  setEditData({ ...editData, to: e.target.value })
                }
                fullWidth
                required
              />
              <DateTimePicker
                label="Departure"
                value={editData.departureTime}
                onChange={(newValue) =>
                  setEditData({ ...editData, departureTime: newValue })
                }
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
              <DateTimePicker
                label="Arrival"
                value={editData.arrivalTime}
                onChange={(newValue) =>
                  setEditData({ ...editData, arrivalTime: newValue })
                }
                slotProps={{ textField: { fullWidth: true } }}
                minDateTime={editData.departureTime}
              />
              <TextField
                label="Carrier/Company"
                value={editData.carrier}
                onChange={(e) =>
                  setEditData({ ...editData, carrier: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Confirmation Number"
                value={editData.confirmationNumber}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    confirmationNumber: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Notes"
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
              />
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  startIcon={<CloseIcon />}
                  onClick={handleCancel}
                  variant="outlined"
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
              {getIcon(transportation.type)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {transportation.from} → {transportation.to}
              </Typography>
            </Box>

            <Box sx={{ ml: 4, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Departure:{" "}
                {dayjs(transportation.departure_time).format(
                  "MMM D, YYYY h:mm A"
                )}
              </Typography>
              {transportation.arrival_time && (
                <Typography variant="body2" color="text.secondary">
                  Arrival:{" "}
                  {dayjs(transportation.arrival_time).format(
                    "MMM D, YYYY h:mm A"
                  )}
                </Typography>
              )}
            </Box>

            {transportation.carrier && (
              <Box sx={{ ml: 4, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Carrier: {transportation.carrier}
                </Typography>
              </Box>
            )}

            {transportation.confirmation_number && (
              <Box sx={{ ml: 4, mb: 1 }}>
                <Chip
                  label={`Confirmation: ${transportation.confirmation_number}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {transportation.notes && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, ml: 4 }}
              >
                {transportation.notes}
              </Typography>
            )}
          </Box>

          <Box>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(transportation.id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
