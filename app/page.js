"use client";
import { useState } from "react";
import Image from "next/image";
import { Box, TextField, Button } from "@mui/material";
import Stack from "@mui/material/Stack"; // Corrected import
import Typography from "@mui/material/Typography"; // Add this import

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I am Matbot. A chat bot where you can ask anything about Mathew Sabu`,
    },
  ]);

  // what the user will send
  const [message, setMessage] = useState("");
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Typography variant="h2" align="center" gutterBottom color="#f9f9f9">
          MatBot
        </Typography>{" "}
      </Box>
      <Stack direction="column" width="800px" height="700px" p={3}>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1} // corrected 'flewGrow' to 'flexGrow'
          overflow="auto"
          maxHeight="100%"
          maxWidth="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              bgcolor={
                message.role === "assistant" ? "#171717" : "secondary.main"
              }
              color="#f9f9f9"
              borderRadius={16}
              p={3}
            >
              {message.content}
            </Box>
          ))}
        </Stack>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            color="primary"
            placeholder="Type a message..."
            fullWidth
            sx={{
              flex: 1,
              "& .MuiInputBase-input": { color: "#f9f9f9" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                borderColor: "1px solid transparent",
              },
            }}
          />
          <Button
          
            variant="contained"
            sx={{ marginLeft: 2, backgroundColor: "#171717", color: "#f9f9f9" }} // Changed color prop to sx
          >
            Send
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
