import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  AutoAwesome as TemplateIcon,
  Edit as CustomIcon,
} from "@mui/icons-material";

export default function ItineraryPrompt({ onCreateBlank, onUseTemplate }) {
  const templates = [
    {
      id: "relaxed",
      name: "Relaxed Explorer",
      description: "Perfect for leisurely trips with flexible scheduling",
      activities: [
        { time: "09:00", activity: "Breakfast at hotel", location: "" },
        { time: "11:00", activity: "Morning activity", location: "" },
        { time: "13:00", activity: "Lunch", location: "" },
        { time: "15:00", activity: "Afternoon activity", location: "" },
        { time: "19:00", activity: "Dinner", location: "" },
      ],
    },
    {
      id: "adventure",
      name: "Adventure Seeker",
      description: "Action-packed days with multiple activities",
      activities: [
        { time: "07:00", activity: "Early breakfast", location: "" },
        { time: "08:30", activity: "Morning adventure", location: "" },
        { time: "12:00", activity: "Lunch break", location: "" },
        { time: "14:00", activity: "Afternoon activity", location: "" },
        { time: "17:00", activity: "Evening activity", location: "" },
        { time: "19:30", activity: "Dinner", location: "" },
        { time: "21:00", activity: "Night activity (optional)", location: "" },
      ],
    },
    {
      id: "cultural",
      name: "Cultural Immersion",
      description: "Focus on local experiences and cultural activities",
      activities: [
        { time: "08:00", activity: "Breakfast", location: "" },
        { time: "09:30", activity: "Visit local market", location: "" },
        { time: "12:00", activity: "Traditional lunch", location: "" },
        { time: "14:00", activity: "Museum or historical site", location: "" },
        { time: "17:00", activity: "Local neighborhood walk", location: "" },
        { time: "19:00", activity: "Traditional dinner", location: "" },
      ],
    },
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "primary.light",
          color: "primary.contrastText",
          mb: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          No Itinerary Yet
        </Typography>
        <Typography variant="body1">
          Start planning your daily activities to make the most of your trip!
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CustomIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6">Start from Scratch</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Create a completely custom itinerary from the ground up. Perfect
                if you have a specific plan in mind or want full creative
                control.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                fullWidth
                onClick={onCreateBlank}
              >
                Create Blank Itinerary
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TemplateIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6">Use a Template</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Choose from pre-built templates and customize them to fit your
                needs. A great starting point for any trip!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Choose a Template
        </Typography>
        <Grid container spacing={2}>
          {templates.map((template) => (
            <Grid item xs={12} md={4} key={template.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {template.activities.length} activities per day
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => onUseTemplate(template)}
                  >
                    Use This Template
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
