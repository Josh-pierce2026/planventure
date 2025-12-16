import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Explore as ExploreIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import planventureLogo from "../assets/planventure-logo.svg";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <ExploreIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Plan Your Adventure",
      description:
        "Create detailed trip itineraries with destinations, activities, and more.",
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Daily Itineraries",
      description:
        "Organize your days with time-based activities and locations.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Collaborate",
      description: "Share trips with friends and plan together seamlessly.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Track Everything",
      description:
        "Manage accommodations, transportation, and trip details in one place.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <img
            src={planventureLogo}
            alt="Planventure Logo"
            style={{
              height: "200px",
              marginBottom: "2rem",
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Plan Your Perfect Adventure
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Organize trips, create itineraries, and travel with confidence
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                }}
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Everything You Need to Plan Your Trip
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "grey.100", py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Ready to Start Planning?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of travelers who plan their perfect trips with
            PlanVenture
          </Typography>
          {!isAuthenticated && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
}
