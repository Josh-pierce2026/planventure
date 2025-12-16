import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Skeleton,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function TripCard({ trip, loading = false }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
          <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
          <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} />
          </Box>
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width={100} height={36} />
        </CardActions>
      </Card>
    );
  }

  const handleViewDetails = () => {
    navigate(`/dashboard/trips/${trip.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/trips/${trip.id}/edit`);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM D, YYYY");
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {trip.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 1 }}>
          <LocationIcon sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {trip.destination}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CalendarIcon sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PeopleIcon sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {trip.participantCount || 0} participants
          </Typography>
        </Box>

        <Chip
          label={trip.status || "Planning"}
          color={
            trip.status === "Completed"
              ? "success"
              : trip.status === "Active"
              ? "primary"
              : "default"
          }
          size="small"
        />
      </CardContent>

      <CardActions>
        <Button size="small" onClick={handleViewDetails}>
          View Details
        </Button>
        <Button size="small" color="secondary" onClick={handleEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
