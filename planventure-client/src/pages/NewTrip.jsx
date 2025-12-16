import { Container, Box } from "@mui/material";
import NewTripForm from "../components/NewTripForm";

export default function NewTrip() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <NewTripForm />
      </Box>
    </Container>
  );
}
