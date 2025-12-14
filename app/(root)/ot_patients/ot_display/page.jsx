'use client';

import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Divider, Stack } from '@mui/material';

function convertToISTDate(inputDate) {
  const date = new Date(inputDate);
  const options = { timeZone: "Asia/Kolkata" };

  const day = date.toLocaleString("en-IN", { day: "2-digit", ...options });
  const month = date.toLocaleString("en-IN", { month: "2-digit", ...options });
  const year = date.toLocaleString("en-IN", { year: "numeric", ...options });

  return `${day}-${month}-${year}`;
}

function convertTo12HourFormat(timeStr) {
  let [hour, minute] = timeStr.split(":");
  hour = parseInt(hour, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, "0")}:${minute} ${ampm}`;
}

/* ---------------- STATUS RESOLVER (FIXED LOGIC) ---------------- */

const resolveStatus = (entry) => {
  if (!entry) return { label: 'No Active', color: 'default' };

  if (entry.is_cancelled)
    return { label: 'OT Cancelled', color: 'error' };

  if (entry.is_shifted_recovery)
    return { label: 'Recovery', color: 'secondary' };

  if (entry.is_surgery_completed)
    return { label: 'Surgery Completed', color: 'success' };

  if (entry.is_surgery_started)
    return { label: 'Surgery Ongoing', color: 'warning' };

  if (entry.is_under_preparation)
    return { label: 'Under Preparation', color: 'primary' };

  if (entry.is_in_preop)
    return { label: 'Pre OP', color: 'info' };

  if (entry.is_waiting)
    return { label: 'Waiting', color: 'default' };

  return { label: 'Unknown', color: 'default' };
};

export default function LiveOTDashboard() {
  const [otRooms, setOtRooms] = useState([]);

  const fetchOTRooms = async () => {
    try {
      const res = await fetch('/api/ot-rooms');
      const rooms = await res.json();

      const roomsWithEntries = await Promise.all(
        rooms.map(async (room) => {
          if (room.occupancy_status !== 0) {
            const resEntry = await fetch(`/api/ot-last-entry/${room.room_id}`);
            const entryData = await resEntry.json();
            return { ...room, lastEntry: entryData.data };
          }
          return { ...room, lastEntry: null };
        })
      );

      setOtRooms(roomsWithEntries);
    } catch (err) {
      console.error('Error fetching OT rooms:', err);
    }
  };

  useEffect(() => {
    fetchOTRooms();

    let evtSource = null;
    let reconnectDelay = 2000;

    function connectSSE() {
      evtSource = new EventSource("/api/ot-updates");

      evtSource.onmessage = () => {
        fetchOTRooms();
      };

      evtSource.onerror = () => {
        evtSource.close();
        setTimeout(() => {
          reconnectDelay = Math.min(reconnectDelay * 1.5, 15000);
          connectSSE();
        }, reconnectDelay);
      };
    }

    connectSSE();

    return () => evtSource && evtSource.close();
  }, []);

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom align="center">
        Live OT Dashboard
      </Typography>

      <Grid container spacing={3}>
        {otRooms.map((room) => {
          const status = resolveStatus(room.lastEntry);

          return (
            <Grid item xs={12} sm={6} md={4} key={room.room_id}>
              <Card elevation={6} style={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Typography variant="h6">
                      {room.room_name || `Room ${room.room_id}`}
                    </Typography>

                    <Chip
                      label={room.occupancy_status ? 'Occupied' : 'Empty'}
                      color={room.occupancy_status ? 'error' : 'success'}
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ mb: 1 }} />

                  {room.lastEntry ? (
                    <Stack spacing={0.5}>
                      <Typography><strong>Patient:</strong> {room.lastEntry.patient_name}</Typography>
                      <Typography><strong>UHID:</strong> {room.lastEntry.uhid}</Typography>
                      <Typography><strong>Age:</strong> {room.lastEntry.age} Years</Typography>
                      <Typography><strong>Surgeon:</strong> {room.lastEntry.surgeon}</Typography>

                      <Box mt={1}>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Stack>
                  ) : (
                    <Typography color="textSecondary">No active patient</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
