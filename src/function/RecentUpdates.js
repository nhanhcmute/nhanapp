import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

const RecentUpdates = ({ updates }) => (
  <Grid container spacing={4}>
    {updates.map((update, index) => (
      <Grid item xs={12} md={6} key={index}>
        <Card sx={{ boxShadow: 3 }}>
          <CardMedia
            component="img"
            height="200"
            image={update.image}
            alt={update.title}
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {update.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
              {update.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default RecentUpdates;
