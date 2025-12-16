import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AccommodationCard from "../components/AccommodationCard";
import TransportationCard from "../components/TransportationCard";
import dayjs from "dayjs";

export default function TripOverview() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [transportation, setTransportation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch trip details
      const tripResponse = await fetch(
        `http://localhost:5000/api/trips/${tripId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tripData = await tripResponse.json();
      setTrip(tripData);

      // Fetch accommodations
      const accomResponse = await fetch(
        `http://localhost:5000/api/trips/${tripId}/accommodations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (accomResponse.ok) {
        const accomData = await accomResponse.json();
        setAccommodations(accomData);
      }

      // Fetch transportation
      const transResponse = await fetch(
        `http://localhost:5000/api/trips/${tripId}/transportation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (transResponse.ok) {
        const transData = await transResponse.json();
        setTransportation(transData);
      }
    } catch (err) {
      console.error("Error fetching trip data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccommodation = () => {
    const newAccom = {
      id: `temp-${Date.now()}`,
      name: "New Accommodation",
      check_in: dayjs().format("YYYY-MM-DD"),
      check_out: dayjs().add(1, "day").format("YYYY-MM-DD"),
    };
    setAccommodations([...accommodations, newAccom]);
  };

  const handleAddTransportation = () => {
    const newTrans = {
      id: `temp-${Date.now()}`,
      type: "flight",
      from: "",
      to: "",
      departure_time: dayjs().toISOString(),
    };
    setTransportation([...transportation, newTrans]);
  };

  const handleUpdateAccommodation = (updated) => {
    setAccommodations(
      accommodations.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const handleDeleteAccommodation = (id) => {
    if (window.confirm("Delete this accommodation?")) {
      setAccommodations(accommodations.filter((a) => a.id !== id));
    }
  };

  const handleUpdateTransportation = (updated) => {
    setTransportation(
      transportation.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const handleDeleteTransportation = (id) => {
    if (window.confirm("Delete this transportation?")) {
      setTransportation(transportation.filter((t) => t.id !== id));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {trip?.name} - Overview
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Accommodations</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAccommodation}
          >
            Add Accommodation
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {accommodations.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            No accommodations added yet
          </Typography>
        ) : (
          accommodations.map((accom) => (
            <AccommodationCard
              key={accom.id}
              accommodation={accom}
              onUpdate={handleUpdateAccommodation}
              onDelete={handleDeleteAccommodation}
            />
          ))
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Transportation</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTransportation}
          >
            Add Transportation
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {transportation.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            No transportation added yet
          </Typography>
        ) : (
          transportation.map((trans) => (
            <TransportationCard
              key={trans.id}
              transportation={trans}
              onUpdate={handleUpdateTransportation}
              onDelete={handleDeleteTransportation}
            />
          ))
        )}
      </Paper>
    </Container>
  );
}
