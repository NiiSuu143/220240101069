import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";

export default function ShortenerPage() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/shorturls", {
        url,
        validity: validity ? parseInt(validity) : undefined,
        shortcode: shortcode || undefined,
      });
      setResult(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create Short URL
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Validity (minutes)"
          type="number"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Custom Shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Shorten
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Shortened URL:</Typography>
          <a href={result.shortLink} target="_blank" rel="noreferrer">
            {result.shortLink}
          </a>
          <Typography>Expiry: {result.expiry}</Typography>
        </Paper>
      )}
    </Box>
  );
}
