'use client';
import { Grid, Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import OTInput from "./OTInput";

export default function OTFormNew({
    PatientName, setPatientName,
    UHID, setUHID,
    Age, setAge,
    Diagnosis, setDiagnosis,
    Surgeon, setSurgeon,
    addDetails,
    setNewAdmission
}) {
    return (
        <>
            <Grid item xs={2}><OTInput value={PatientName} onChange={(e) => setPatientName(e.target.value)} /></Grid>
            <Grid item xs={2}><OTInput value={UHID} onChange={(e) => setUHID(e.target.value)} /></Grid>
            <Grid item xs={1}><OTInput type="number" value={Age} onChange={(e) => setAge(e.target.value)} /></Grid>
            <Grid item xs={3}><OTInput value={Diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></Grid>
            <Grid item xs={2}><OTInput value={Surgeon} onChange={(e) => setSurgeon(e.target.value)} /></Grid>

            <Grid item xs={1} display="flex" position="relative">
                <Button variant="contained" color="success" fullWidth onClick={() => { addDetails(); }}>Submit</Button>
                <IconButton color="error" onClick={() => setNewAdmission(true)} sx={{ position: "absolute", right: -40, top: 5 }}>
                    <Delete />
                </IconButton>
            </Grid>
        </>
    );
}
