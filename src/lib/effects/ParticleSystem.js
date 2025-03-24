/**
 * Partikel-System für die 3D-Szene
 * Erzeugt atmosphärische Partikel an allen Seiten des Flurs (Wände, Boden, Decke)
 */
export class ParticleSystem {
    constructor(THREE, scene, options = {}) {
      this.THREE = THREE;
      this.scene = scene;
      
      // Erweiterte Optionen mit Wandverteilung
      this.options = {
        particleCount: options.particleCount || 2000,
        particleColor: options.particleColor || 0x050035,
        particleSize: options.particleSize || 0.15,
        particleOpacity: options.particleOpacity || 1,
        minX: options.minX || 10,         // Mindestabstand vom Zentrum (X-Achse/Seitenwände)
        maxY: options.maxY || 15,         // Maximale Höhe für Seitenwände
        floorCeilingWidth: options.floorCeilingWidth || 15, // Breite von Boden/Decke
        minZ: options.minZ || -75,        // Minimale Z-Position
        maxZ: options.maxZ || 25,         // Maximale Z-Position
        distribution: options.distribution || {
          sides: 0.7,  // 70% der Partikel an den Seitenwänden
          ceiling: 0.15, // 15% der Partikel an der Decke
          floor: 0.15  // 15% der Partikel am Boden
        }
      };
      
      this.particles = null;
      this.velocities = [];
      
      this.initialize();
    }
    
    initialize() {
      const { THREE, scene, options } = this;
      const { particleCount, particleColor, particleSize, particleOpacity, distribution } = options;
      
      // Geometrie erstellen
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      // Partikelverteilung berechnen
      const sideCount = Math.floor(particleCount * distribution.sides);
      const ceilingCount = Math.floor(particleCount * distribution.ceiling);
      const floorCount = particleCount - sideCount - ceilingCount;
      
      let particleIndex = 0;
      
      // 1. Seitenwand-Partikel
      for (let i = 0; i < sideCount; i++) {
        const i3 = particleIndex * 3;
        const side = Math.random() > 0.5 ? 1 : -1;
        
        // X-Position (links oder rechts)
        positions[i3] = side * (options.minX + Math.random() * 8);
        
        // Y-Position (Höhe)
        positions[i3 + 1] = Math.random() * options.maxY * 2 - options.maxY;
        
        // Z-Position (entlang des Flurs)
        positions[i3 + 2] = (Math.random() * (options.maxZ - options.minZ)) + options.minZ;
        
        // Geschwindigkeit: horizontal für Seitenwände
        this.velocities.push({
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.015,
          wall: 'side'
        });
        
        particleIndex++;
      }
      
      // 2. Decken-Partikel
      for (let i = 0; i < ceilingCount; i++) {
        const i3 = particleIndex * 3;
        
        // X-Position (Breite der Decke)
        positions[i3] = (Math.random() * options.floorCeilingWidth * 2) - options.floorCeilingWidth;
        
        // Y-Position (fixe Höhe für Decke)
        positions[i3 + 1] = options.maxY + Math.random() * 2; 
        
        // Z-Position (entlang des Flurs)
        positions[i3 + 2] = (Math.random() * (options.maxZ - options.minZ)) + options.minZ;
        
        // Geschwindigkeit: nach unten gerichtet für Decke
        this.velocities.push({
          x: (Math.random() - 0.5) * 0.006,
          y: -(Math.random() * 0.004 + 0.002),
          z: (Math.random() - 0.5) * 0.015,
          wall: 'ceiling'
        });
        
        particleIndex++;
      }
      
      // 3. Boden-Partikel
      for (let i = 0; i < floorCount; i++) {
        const i3 = particleIndex * 3;
        
        // X-Position (Breite des Bodens)
        positions[i3] = (Math.random() * options.floorCeilingWidth * 2) - options.floorCeilingWidth;
        
        // Y-Position (fixe Höhe für Boden)
        positions[i3 + 1] = -options.maxY - Math.random() * 2;
        
        // Z-Position (entlang des Flurs)
        positions[i3 + 2] = (Math.random() * (options.maxZ - options.minZ)) + options.minZ;
        
        // Geschwindigkeit: nach oben gerichtet für Boden
        this.velocities.push({
          x: (Math.random() - 0.5) * 0.006,
          y: Math.random() * 0.004 + 0.002,
          z: (Math.random() - 0.5) * 0.015,
          wall: 'floor'
        });
        
        particleIndex++;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      // Material mit runderen Punkten
      const material = new THREE.PointsMaterial({
        color: particleColor,
        size: particleSize,
        transparent: true,
        opacity: particleOpacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      });
      
      this.particles = new THREE.Points(geometry, material);
      scene.add(this.particles);
    }
    
    animate() {
      if (!this.particles) return;
      
      const { options, velocities } = this;
      const positions = this.particles.geometry.attributes.position.array;
      
      for (let i = 0; i < options.particleCount; i++) {
        const i3 = i * 3;
        const vel = velocities[i];
        
        positions[i3] += vel.x;
        positions[i3 + 1] += vel.y + Math.sin(Date.now() * 0.001 + i) * 0.002;
        positions[i3 + 2] += vel.z;
        
        // Je nach Wand-Typ unterschiedliche Grenzen prüfen
        switch (vel.wall) {
          case 'side':
            // Seitenwände: X-Grenzen prüfen
            if (positions[i3] > 0 && positions[i3] < options.minX) {
              positions[i3] = options.minX + Math.random() * 8;
            } else if (positions[i3] < 0 && positions[i3] > -options.minX) {
              positions[i3] = -options.minX - Math.random() * 8;
            }
            
            // X-Maximalgrenze
            if (Math.abs(positions[i3]) > 25) {
              const side = positions[i3] > 0 ? 1 : -1;
              positions[i3] = side * (options.minX + Math.random() * 8);
            }
            
            // Y-Grenzen für Seitenwände
            if (Math.abs(positions[i3 + 1]) > options.maxY) {
              positions[i3 + 1] = Math.sign(positions[i3 + 1]) * options.maxY * 0.8;
            }
            break;
            
          case 'ceiling':
            // Decke: Y-Grenzen prüfen
            if (positions[i3 + 1] < options.maxY) {
              positions[i3 + 1] = options.maxY + Math.random() * 2;
            } else if (positions[i3 + 1] > options.maxY + 5) {
              positions[i3 + 1] = options.maxY + Math.random() * 2;
            }
            
            // X-Grenzen für Decke
            if (Math.abs(positions[i3]) > options.floorCeilingWidth) {
              positions[i3] = (Math.random() * options.floorCeilingWidth * 2) - options.floorCeilingWidth;
            }
            break;
            
          case 'floor':
            // Boden: Y-Grenzen prüfen
            if (positions[i3 + 1] > -options.maxY) {
              positions[i3 + 1] = -options.maxY - Math.random() * 2;
            } else if (positions[i3 + 1] < -options.maxY - 5) {
              positions[i3 + 1] = -options.maxY - Math.random() * 2;
            }
            
            // X-Grenzen für Boden
            if (Math.abs(positions[i3]) > options.floorCeilingWidth) {
              positions[i3] = (Math.random() * options.floorCeilingWidth * 2) - options.floorCeilingWidth;
            }
            break;
        }
        
        // Z-Grenzen gemeinsam für alle Partikel
        if (positions[i3 + 2] > options.maxZ) {
          positions[i3 + 2] = options.minZ;
        } else if (positions[i3 + 2] < options.minZ) {
          positions[i3 + 2] = options.maxZ;
        }
      }
      
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    /**
     * Entfernt das Partikelsystem aus der Szene und gibt Ressourcen frei
     */
    dispose() {
      if (this.particles) {
        this.scene.remove(this.particles);
        this.particles.geometry.dispose();
        this.particles.material.dispose();
        this.particles = null;
        this.velocities = [];
      }
    }
    
    /**
     * Passt die Sichtbarkeit der Partikel an
     */
    setVisibility(visible) {
      if (this.particles) {
        this.particles.visible = visible;
      }
    }
    
    /**
     * Passt die Partikelanzahl dynamisch an (für Performance-Optimierung)
     */
    setParticleCount(count) {
      // Bestehende Partikel entfernen
      this.dispose();
      
      // Neue Optionen setzen
      this.options.particleCount = count;
      
      // Neu initialisieren
      this.initialize();
    }
  }