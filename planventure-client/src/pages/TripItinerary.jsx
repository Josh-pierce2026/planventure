import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import ItineraryPrompt from "../components/ItineraryPrompt";
import ItineraryDay from "../components/ItineraryDay";
import dayjs from "dayjs";

export default function TripItinerary() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasItinerary, setHasItinerary] = useState(false);

  useEffect(() => {
    fetchTripAndItinerary();
  }, [tripId]);

  const fetchTripAndItinerary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch trip details
      const tripResponse = await fetch(
        `http://localhost:5000/api/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!tripResponse.ok) throw new Error("Failed to fetch trip");
      const tripData = await tripResponse.json();
      setTrip(tripData);

      // Fetch itinerary
      const itineraryResponse = await fetch(
        `http://localhost:5000/api/trips/${tripId}/itinerary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (itineraryResponse.ok) {
        const itineraryData = await itineraryResponse.json();
        setItineraryDays(itineraryData.days || []);
        setTimeSlots(itineraryData.timeSlots || []);
        setHasItinerary(itineraryData.days?.length > 0);
      }
    } catch (err) {
      console.error("Error fetching trip/itinerary:", err);
    } finally {
      setLoading(false);
    }
  };

  const createItineraryDays = (template = null) => {
    if (!trip) return;

    const startDate = dayjs(trip.start_date);
    const endDate = dayjs(trip.end_date);
    const days = [];
    const slots = [];

    let currentDate = startDate;
    let dayNumber = 1;

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const dayId = `day-${dayNumber}`;
      days.push({
        id: dayId,
        dayNumber,
        date: currentDate.format("YYYY-MM-DD"),
      });

      if (template) {
        template.activities.forEach((activity, index) => {
          slots.push({
            id: `${dayId}-slot-${index}`,
            dayId,
            time: activity.time,
            activity: activity.activity,
            location: activity.location,
            notes: "",
          });
        });
      }

      currentDate = currentDate.add(1, "day");
      dayNumber++;
    }

    setItineraryDays(days);
    setTimeSlots(slots);
    setHasItinerary(true);
  };

  const handleCreateBlank = () => {
    createItineraryDays(null);
  };

  const handleUseTemplate = (template) => {
    createItineraryDays(template);
  };

  const handleAddTimeSlot = (newSlot) => {
    const slot = {
      ...newSlot,
      id: `slot-${Date.now()}`,
    };
    setTimeSlots([...timeSlots, slot]);
  };

  const handleUpdateTimeSlot = (updatedSlot) => {
    setTimeSlots(
      timeSlots.map((slot) => (slot.id === updatedSlot.id ? updatedSlot : slot))
    );
  };

  const handleDeleteTimeSlot = (slotId) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Itinerary - {trip?.name}
      </Typography>

      {!hasItinerary ? (
        <ItineraryPrompt
          onCreateBlank={handleCreateBlank}
          onUseTemplate={handleUseTemplate}
        />
      ) : (
        <Box>
          {itineraryDays.map((day) => (
            <ItineraryDay
              key={day.id}
              day={day}
              timeSlots={timeSlots.filter((slot) => slot.dayId === day.id)}
              onAddTimeSlot={handleAddTimeSlot}
              onUpdateTimeSlot={handleUpdateTimeSlot}
              onDeleteTimeSlot={handleDeleteTimeSlot}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}
