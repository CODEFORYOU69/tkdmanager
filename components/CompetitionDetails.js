import React, { useEffect, useState, useRef } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

const CompetitionDetails = ({ competition }) => {
  const [fighters, setFighters] = useState([]);

  useEffect(() => {
    fetch(`/api/match/fighters?competitionId=${competition.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFighters(
          data.map((fighter) => ({
            ...fighter,
            imageUrl: fighter.image,
          }))
        );
      })
      .catch((err) => console.error("Failed to load fighters", err));
  }, [competition]);

const downloadImage = async (backgroundUrl, overlayUrl, filename) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;

  const loadImg = (src) =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  try {
    const background = await loadImg(backgroundUrl);
    const overlay = await loadImg(overlayUrl);

    // Draw the background image
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw the blue circle
    ctx.beginPath();
    ctx.arc(300, 300, 100, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw the white circle
    ctx.beginPath();
    ctx.arc(300, 300, 90, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw the red circle
    ctx.beginPath();
    ctx.arc(300, 300, 80, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw the overlay image inside the red circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(300, 300, 80, 0, 2 * Math.PI);
    ctx.clip();
    // Calculate the size to draw the overlay
    const overlayDiameter = 160; // 80 radius * 2
    const overlayX = 220; // 300 - 80
    const overlayY = 220; // 300 - 80
    ctx.drawImage(overlay, overlayX, overlayY, overlayDiameter, overlayDiameter);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error generating image:", err);
  }
};



  return (
    <div>
      <Typography variant="h4" color="primary" gutterBottom>
        Fighters in {competition.name}
      </Typography>
      {fighters.map((fighter) => (
        <Card key={fighter.id} sx={{ marginBottom: 2 }}>
  <CardContent>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src={competition.image}
        layout="fill"
        objectFit="cover"
        alt="Background"
      />
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "10px solid blue",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: "10px solid white",
          clipPath: "circle(80px at center)",
          overflow: "hidden",
        }}
      >
        <Image
          src={fighter.image}
          layout="fill"
          objectFit="cover"
          alt="Fighter"
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "10px solid red",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            downloadImage(
              competition.image,
              fighter.image,
              `Fighter_${fighter.firstName}_${fighter.lastName}_in_${competition.name}.png`
            )
          }
          disabled={fighters.length === 0}
        >
          Download Image
        </Button>
      </div>
    </div>
  </CardContent>
</Card>

      ))}
    </div>
  );
};

export default CompetitionDetails;
