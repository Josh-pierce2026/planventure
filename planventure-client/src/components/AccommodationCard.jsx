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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function AccommodationCard({
  accommodation,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: accommodation.name,
    address: accommodation.address || "",
    checkIn: dayjs(accommodation.check_in),
    checkOut: dayjs(accommodation.check_out),
    confirmationNumber: accommodation.confirmation_number || "",
    phone: accommodation.phone || "",
    website: accommodation.website || "",
    notes: accommodation.notes || "",
  });

  const handleSave = () => {
    onUpdate({
      ...accommodation,
      name: editData.name,
      address: editData.address,
      check_in: editData.checkIn.format("YYYY-MM-DD"),
      check_out: editData.checkOut.format("YYYY-MM-DD"),
      confirmation_number: editData.confirmationNumber,
      phone: editData.phone,
      website: editData.website,
      notes: editData.notes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: accommodation.name,
      address: accommodation.address || "",
      checkIn: dayjs(accommodation.check_in),
      checkOut: dayjs(accommodation.check_out),
      confirmationNumber: accommodation.confirmation_number || "",
      phone: accommodation.phone || "",
      website: accommodation.website || "",
      notes: accommodation.notes || "",
    });
  };

  if (isEditing) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ mb: 2, border: "2px solid", borderColor: "primary.main" }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Hotel/Accommodation Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Address"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Check-in"
                  value={editData.checkIn}
                  onChange={(newValue) =>
                    setEditData({ ...editData, checkIn: newValue })
                  }
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
                <DatePicker
                  label="Check-out"
                  value={editData.checkOut}
                  onChange={(newValue) =>
                    setEditData({ ...editData, checkOut: newValue })
                  }
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                  minDate={editData.checkIn}
                />
              </Box>
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
                label="Phone"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Website"
                value={editData.website}
                onChange={(e) =>
                  setEditData({ ...editData, website: e.target.value })
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
              <HotelIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">{accommodation.name}</Typography>
            </Box>

            {accommodation.address && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, ml: 4 }}>
                <LocationIcon
                  sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {accommodation.address}
                </Typography>
              </Box>
            )}

            <Box sx={{ ml: 4, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Check-in: {dayjs(accommodation.check_in).format("MMM D, YYYY")}{" "}
                | Check-out:{" "}
                {dayjs(accommodation.check_out).format("MMM D, YYYY")}
              </Typography>
            </Box>

            {accommodation.confirmation_number && (
              <Box sx={{ ml: 4, mb: 1 }}>
                <Chip
                  label={`Confirmation: ${accommodation.confirmation_number}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {accommodation.phone && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, ml: 4 }}>
                <PhoneIcon
                  sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {accommodation.phone}
                </Typography>
              </Box>
            )}

            {accommodation.website && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, ml: 4 }}>
                <LinkIcon
                  sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                />
                <Typography
                  variant="body2"
                  component="a"
                  href={accommodation.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "primary.main", textDecoration: "none" }}
                >
                  View Website
                </Typography>
              </Box>
            )}

            {accommodation.notes && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, ml: 4 }}
              >
                {accommodation.notes}
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
              onClick={() => onDelete(accommodation.id)}
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
