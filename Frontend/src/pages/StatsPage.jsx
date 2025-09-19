import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, List, ListItem } from "@mui/material";
import axios from "axios";

export default function StatsPage() {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!code) {
      setError("Shortcode is required");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${code}`);
      setStats(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Short URL Statistics
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Enter Shortcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleFetch}>
          Get Stats
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>

      {stats && (
        <Paper sx={{ p: 2 }}>
          <Typography>Original URL: {stats.originalUrl}</Typography>
          <Typography>Total Clicks: {stats.clicks}</Typography>
          <Typography>Expiry: {stats.expiry}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Click Details</Typography>
          <List>
            {stats.clickData?.map((click, i) => (
              <ListItem key={i}>
                {click.timestamp} - {click.referrer} - {click.location}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
