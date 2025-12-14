'use client';
import { TextField } from "@mui/material";

const textFieldStyle = {
    height: "100%",                          // 1) TextField outer wrapper height

    "& .MuiOutlinedInput-root": {
        height: "100%",                      // 2) Make input box fill height
        alignItems: "center",
        // 🔥 Disabled mode styling
        "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",   // dim background
            borderRadius: "4px",

            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white !important",            // white border
            },

            "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "white !important",    // text color white in disabled mode
                opacity: 1,                                  // prevent greyed-out text
            }
        }
    },

    "& .MuiInputBase-input": {
        padding: "10px",                     // 3) Adjust padding so text stays centered
        color: "white",
        height: "100%",                      // Optional if you want fully stretched input
        boxSizing: "border-box",
    },

    "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" }
};


export default function OTInput({ is_cancelled, value, onChange, type = "text" }) {
    return (
        <TextField
            fullWidth
            disabled={is_cancelled}
            type={type}
            sx={textFieldStyle}
            value={value}
            onChange={onChange}
        />
    );
}
