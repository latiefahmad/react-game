import React, { useEffect, useState } from "react";
import "./Confetti.css";

const Confetti = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Create confetti particles from left and right corners
      const newParticles = [];

      // Left corner explosion
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: `left-${i}`,
          x: 50 + Math.random() * 100, // Start from left corner area
          y: window.innerHeight - 100, // Start from bottom
          color: getRandomColor(),
          size: Math.random() * 10 + 6,
          speedX: Math.random() * 8 + 3, // Move right
          speedY: -(Math.random() * 15 + 10), // Move up (negative for upward)
          gravity: 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
        });
      }

      // Right corner explosion
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: `right-${i}`,
          x: window.innerWidth - 150 + Math.random() * 100, // Start from right corner area
          y: window.innerHeight - 100, // Start from bottom
          color: getRandomColor(),
          size: Math.random() * 10 + 6,
          speedX: -(Math.random() * 8 + 3), // Move left (negative)
          speedY: -(Math.random() * 15 + 10), // Move up (negative for upward)
          gravity: 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
        });
      }

      // Center burst for extra effect
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const speed = Math.random() * 8 + 5;
        newParticles.push({
          id: `center-${i}`,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          color: getRandomColor(),
          size: Math.random() * 8 + 4,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          gravity: 0.2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 20,
          life: 1,
          decay: Math.random() * 0.015 + 0.008,
        });
      }

      setParticles(newParticles);

      // Animate particles
      const animateParticles = () => {
        setParticles((prevParticles) => {
          const updatedParticles = prevParticles
            .map((particle) => ({
              ...particle,
              x: particle.x + particle.speedX,
              y: particle.y + particle.speedY,
              speedY: particle.speedY + particle.gravity, // Apply gravity
              rotation: particle.rotation + particle.rotationSpeed,
              life: particle.life - particle.decay,
            }))
            .filter(
              (particle) =>
                particle.life > 0 && particle.y < window.innerHeight + 100
            );

          return updatedParticles;
        });
      };

      const animationInterval = setInterval(animateParticles, 16); // ~60fps

      // Clear confetti after animation
      const timer = setTimeout(() => {
        clearInterval(animationInterval);
        setParticles([]);
        if (onComplete) onComplete();
      }, 4000);

      return () => {
        clearInterval(animationInterval);
        clearTimeout(timer);
      };
    }
  }, [isActive, onComplete]);

  const getRandomColor = () => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
      "#ff9f43",
      "#10ac84",
      "#ee5a24",
      "#0abde3",
      "#feca57",
      "#ff6348",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle-burst"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.life,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
