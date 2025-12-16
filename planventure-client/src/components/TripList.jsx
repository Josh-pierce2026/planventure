import { Grid, Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import TripCard from "./TripCard";
import { useNavigate } from "react-router-dom";

export default function TripList({
  trips = [],
  loading = false,
  error = null,
  WelcomeMessage,
  ErrorState,
}) {
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    navigate("/dashboard/trips/new");
  };

  if (error) {
    if (ErrorState) {
      return <ErrorState />;
    }
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!loading && trips.length === 0) {
    if (WelcomeMessage) {
      return <WelcomeMessage />;
    }
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 2,
        }}
      >
        <Typography variant="h5" gutterBottom color="text.secondary">
          No trips yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start planning your next adventure!
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTrip}
        >
          Create Your First Trip
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTrip}
        >
          New Trip
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <TripCard loading={true} />
              </Grid>
            ))
          : trips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip.id}>
                <TripCard trip={trip} />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}
