/**
 * Partikel-System für die 3D-Szene
 * Erzeugt atmosphärische Partikel an den Rändern des Flurs
 */

export class ParticleSystem {
    constructor(THREE, scene, options = {}) {
      this.THREE = THREE;
      this.scene = scene;
      
      // Standardoptionen mit übergebenen Optionen zusammenführen
      this.options = {
        particleCount: options.particleCount || 2000,
        particleColor: options.particleColor || 0x333344,
        particleSize: options.particleSize || 0.3,
        particleOpacity: options.particleOpacity || 0.6,
        minX: options.minX || 12, // Mindestabstand vom Zentrum (X-Achse)
        maxY: options.maxY || 6,  // Maximale Höhe (Y-Achse)
        minZ: options.minZ || -45, // Minimale Z-Position
        maxZ: options.maxZ || 15   // Maximale Z-Position
      };
      
      this.particles = null;
      this.velocities = [];
      
      this.initialize();
    }
    
    /**
     * Erstellt das Partikelsystem und fügt es der Szene hinzu
     */
    initialize() {
      const { THREE, scene, options } = this;
      const { particleCount, particleColor, particleSize, particleOpacity } = options;
      
      // Geometrie erstellen
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      // Zufällige Positionen - NUR auf den Seiten, nicht in der Mitte
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const side = Math.random() > 0.5 ? 1 : -1;
        
        // Positioniere Partikel weiter außen
        positions[i3] = side * (options.minX + Math.random() * 8);
        
        // Vertikale Position - verteilt für bessere Raumfüllung
        positions[i3 + 1] = Math.random() * options.maxY * 2 - options.maxY;
        
        // Z-Position entlang des Flurs
        positions[i3 + 2] = (Math.random() * (options.maxZ - options.minZ)) + options.minZ;
        
        // Geschwindigkeiten speichern
        this.velocities.push({
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.015
        });
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
    
    /**
     * Animiert die Partikel - wird im Animation Loop aufgerufen
     */
    animate() {
      if (!this.particles) return;
      
      const { options, velocities } = this;
      const positions = this.particles.geometry.attributes.position.array;
      
      for (let i = 0; i < options.particleCount; i++) {
        const i3 = i * 3;
        
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y + Math.sin(Date.now() * 0.001 + i) * 0.004;
        positions[i3 + 2] += velocities[i].z;
        
        // Grenzen prüfen und zurücksetzen
        // X-Position: Halte Partikel an den Seiten
        if (positions[i3] > 0 && positions[i3] < options.minX) {
          positions[i3] = options.minX + Math.random() * 8;
        } else if (positions[i3] < 0 && positions[i3] > -options.minX) {
          positions[i3] = -options.minX - Math.random() * 8;
        }
        
        // Weitere Grenzen
        if (Math.abs(positions[i3]) > 25) {
          const side = positions[i3] > 0 ? 1 : -1;
          positions[i3] = side * (options.minX + Math.random() * 8);
        }
        
        if (Math.abs(positions[i3 + 1]) > options.maxY) {
          positions[i3 + 1] = Math.sign(positions[i3 + 1]) * options.maxY * 0.8;
        }
        
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