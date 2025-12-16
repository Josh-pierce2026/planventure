import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Save as SaveIcon } from "@mui/icons-material";

export default function NewTripForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: null,
    endDate: null,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Trip name is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      if (dayjs(formData.endDate).isBefore(dayjs(formData.startDate))) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          destination: formData.destination,
          start_date: dayjs(formData.startDate).format("YYYY-MM-DD"),
          end_date: dayjs(formData.endDate).format("YYYY-MM-DD"),
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create trip");
      }

      const data = await response.json();
      navigate(`/dashboard/trips/${data.id}`);
    } catch (err) {
      setSubmitError(err.message);
      console.error("Error creating trip:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Trip
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Trip Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Destination"
            value={formData.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            error={!!errors.destination}
            helperText={errors.destination}
            margin="normal"
            required
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(newValue) => handleChange("startDate", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                  required: true,
                },
              }}
              minDate={dayjs()}
            />

            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(newValue) => handleChange("endDate", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endDate,
                  helperText: errors.endDate,
                  required: true,
                },
              }}
              minDate={formData.startDate || dayjs()}
            />
          </Box>

          <TextField
            fullWidth
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              disabled={loading}
              fullWidth
            >
              {loading ? "Creating..." : "Create Trip"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
