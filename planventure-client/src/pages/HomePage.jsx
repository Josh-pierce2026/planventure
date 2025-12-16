import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to PlanVenture
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Plan your adventures with ease
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
