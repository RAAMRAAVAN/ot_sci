'use client';
import {
    Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Box, Typography
} from "@mui/material";
import { useState } from "react";
import OTInput from "./OTInput";
import OTStatusCheckboxes from "./OTStatusCheckboxes";

export default function OTFormOccupied({ ...props }) {

    const {
        id,
        RevertCancelOT,
        is_cancelled,
        room_id,
        PatientName, setPatientName,
        UHID, setUHID,
        Age, setAge,
        Diagnosis, setDiagnosis,
        Surgeon, setSurgeon,
        isChanged,
        // resetChanged,
        cancelOT,
        is_waiting,
        is_in_ot,
        is_surgery_started,
        is_under_preparation,
        is_surgery_completed,
        is_shifted_recovery,
        setWaiting,
        setOt,
        setPreparation,
        setSurgery,
        setSurgeryCompleted,
        setRecovery,
        fetchOTRooms,
        fetchLastEntry,
        completeOT,
        is_in_preop,
        setPreop
    } = props;

    const [openConfirm, setOpenConfirm] = useState(false);

    // 🔥 Update confirmation dialog
    const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);

    // 🔥 SUCCESS dialog
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

    const handleCancelClick = () => setOpenConfirm(true);
    const handleClose = () => setOpenConfirm(false);

    const handleConfirm = () => {
        setOpenConfirm(false);
        completeOT(id);
    };

    // 🔥 UPDATE API CALL
    const performUpdate = async () => {
        const res = await fetch("/api/ot-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                entry_id: id,
                room_id: room_id,
                patient_name: PatientName,
                uhid: UHID,
                age: Age,
                diagnosis: Diagnosis,
                surgeon: Surgeon,
                is_waiting,
                is_in_preop,
                is_in_ot,
                is_surgery_started,
                is_under_preparation,
                is_surgery_completed,
                is_shifted_recovery
            })
        });

        const data = await res.json();

        if (data.success) {
            setOpenSuccessDialog(true);  // 🔥 SHOW SUCCESS POPUP
            fetchOTRooms();
            fetchLastEntry();
            // resetChanged();
        } else {
            alert("Failed to update: " + data.error);
        }
    };

    return (
        <>

            {/* ------------------------------------------------------ */}
            {/* 🔥 SUCCESS DIALOG */}
            {/* ------------------------------------------------------ */}
            <Dialog
                open={openSuccessDialog}
                onClose={() => setOpenSuccessDialog(false)}
            >
                <DialogTitle>{"Update Successful"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        OT details were updated successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenSuccessDialog(false)}
                        autoFocus
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------ */}
            {/* 🔥 UPDATE CONFIRMATION DIALOG */}
            {/* ------------------------------------------------------ */}
            <Dialog open={openUpdateConfirm} onClose={() => setOpenUpdateConfirm(false)}>
                <DialogTitle>{"Update OT Details?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to update this OT entry?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateConfirm(false)}>No</Button>

                    <Button
                        color="success"
                        autoFocus
                        onClick={() => {
                            setOpenUpdateConfirm(false);
                            performUpdate();
                        }}
                    >
                        Yes, Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------ */}
            {/* FORM FIELDS */}
            {/* ------------------------------------------------------ */}
            <Grid item xs={2}><OTInput is_cancelled={is_cancelled} value={PatientName} onChange={(e) => setPatientName(e.target.value)} /></Grid>
            <Grid item xs={2}><OTInput is_cancelled={is_cancelled} value={UHID} onChange={(e) => setUHID(e.target.value)} /></Grid>
            <Grid item xs={1}><OTInput is_cancelled={is_cancelled} type="number" value={Age} onChange={(e) => setAge(e.target.value)} /></Grid>
            <Grid item xs={3}><OTInput is_cancelled={is_cancelled} value={Diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></Grid>
            <Grid item xs={2}><OTInput is_cancelled={is_cancelled} value={Surgeon} onChange={(e) => setSurgeon(e.target.value)} /></Grid>

            {/* ------------------------------------------------------ */}
            {/* BUTTONS */}
            {/* ------------------------------------------------------ */}
            <Grid item xs={1}>
                {isChanged ? (
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => setOpenUpdateConfirm(true)}
                    >
                        Update
                    </Button>
                ) : (
                    <Button variant="contained" disabled={!(is_surgery_completed === 1 || is_cancelled === 1)} color="warning" sx={{
                        "&.Mui-disabled": {
                            backgroundColor: "rgba(255, 193, 7, 0.35)",   // lighter yellow
                            color: "warning.contrastText",
                        }
                    }} fullWidth onClick={handleCancelClick}>
                        Discharge
                    </Button>
                )}
            </Grid>

            {/* ------------------------------------------------------ */}
            {/* CANCEL OT DIALOG */}
            {/* ------------------------------------------------------ */}
            <Dialog open={openConfirm} onClose={handleClose}>
                <DialogTitle>{"Cancel OT?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to close the case? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleConfirm} color="error" autoFocus>
                        Yes, Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ------------------------------------------------------ */}
            {/* PATIENT STATUS */}
            {/* ------------------------------------------------------ */}
            <Grid item xs={12} display="flex" paddingY={1}>
                <Box width="200px" padding={1}>
                    <Typography color="#53e85a" fontWeight="bold">Patient Status:</Typography>
                </Box>

                <OTStatusCheckboxes
                    RevertCancelOT={RevertCancelOT}
                    is_cancelled={is_cancelled}
                    cancelOT={cancelOT}
                    id={id}
                    is_in_preop={is_in_preop}
                    setPreop = {setPreop}
                    is_waiting={is_waiting} setWaiting={setWaiting}
                    is_under_preparation={is_under_preparation} setPreparation={setPreparation}
                    is_in_ot={is_in_ot} setOt={setOt}
                    is_surgery_started={is_surgery_started} setSurgery={setSurgery}
                    is_surgery_completed={is_surgery_completed} setSurgeryCompleted={setSurgeryCompleted}
                    is_shifted_recovery={is_shifted_recovery} setRecovery={setRecovery}
                />
            </Grid>
        </>
    );
}
