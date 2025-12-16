import { useParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import EditTripForm from "../components/EditTripForm";

export default function EditTrip() {
  const { tripId } = useParams();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <EditTripForm tripId={tripId} />
      </Box>
    </Container>
  );
}
