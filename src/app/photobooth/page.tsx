"use client";
import CameraBooth from "../../components/CameraBooth";

export default function PhotoboothPage() {
  return (
    <div>
      <div className="photobooth-grid">
        <div className="video-wrap">
          <CameraBooth />
        </div>
      </div>
    </div>
  );
}
