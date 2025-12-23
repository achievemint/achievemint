import {CircularProgress} from "@mui/material";

export default function Loading() {
    return <div className="w-full h-full flex flex-col">
        <CircularProgress size="10rem" className="m-auto"/>
    </div>
}