"use client";
import { useState } from "react";
import Image from "next/image"; // Unused import removed
import { Box, TextField, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I am Matbot. A chat bot where you can ask anything about Mathew Sabu`,
    },
  ]);

  // what the user will send
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = " ";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { strem: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };
  const theme = createTheme({
    // Add theme creation
    palette: {
      primary: {
        main: "#171717",
      },
      secondary: {
        main: "#f9f9f9",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {" "}
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            color="#f9f9f9"
            mt={5}
          >
            MatBot
          </Typography>
        </Box>
        <Stack direction="column" width="645px" height="700px" p={3}>
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
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
              placeholder="Type a message..."
              fullWidth
              InputProps={{
                style: { color: "#f9f9f9" },
              }}
            />
            <Button
              variant="contained"
              sx={{
                marginLeft: 2,
                backgroundColor: "#171717",
                color: "#f9f9f9",
              }}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
