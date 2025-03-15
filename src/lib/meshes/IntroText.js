/**
 * Klasse zur Verwaltung des Intro-Texts mit wechselnden Begrüßungen
 */
export class IntroText {
  /**
   * Erstellt eine neue IntroText-Instanz
   * @param {Object} THREE - Die THREE.js-Bibliothek
   */
  constructor(THREE) {
    this.THREE = THREE;
    this.isMobile = window.innerWidth <= 768;
    
    // Canvas und Context erstellen
    this.canvas = document.createElement('canvas');
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = 1024 * ratio;
    this.canvas.height = 512 * ratio;
    this.context = this.canvas.getContext('2d');
    this.context.scale(ratio, ratio);
    
    // Wechselnde Begrüßungen
    this.greetings = ["Hello.", "你好.", "Bonjour.", "Hallo.", "안녕하세요.", "Hola."];
    this.currentGreetingIndex = 0;
    this.updateInterval = null;
    
    // Textur erstellen
    this.texture = new this.THREE.CanvasTexture(this.canvas);
    
    // Filter für schärferen Text
    this.texture.generateMipmaps = false;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.NearestFilter;
  }
  
  /**
   * Aktualisiert den mobilen Status
   * @param {boolean} isMobile - Ist das Gerät mobil?
   */
  setMobileMode(isMobile) {
    console.log("IntroText: setMobileMode aufgerufen mit isMobile =", isMobile);
    console.log("IntroText: aktueller Status this.isMobile =", this.isMobile);
    
    if (this.isMobile !== isMobile) {
      this.isMobile = isMobile;
      console.log("IntroText: Mobile-Status geändert zu", isMobile);
      this.updateCanvasText();
      
      // Position und Skalierung anpassen wenn das Mesh existiert
      if (this.mesh) {
        if (isMobile) {
          // Für mobile: Positioniere den Text etwas anders
          this.mesh.position.x = -0.2;  // Nach rechts verschieben (größerer Wert = weiter rechts)
          this.mesh.position.y = 0; // Nach oben verschieben (weniger negativ = höher)
          
          // Skalierung anpassen falls nötig
          this.mesh.scale.set(0.65, 0.65, 0.65);
        } else {
          // Desktop-Position wiederherstellen
          this.mesh.position.x = 0;    // Zentriert
          this.mesh.position.y = 0;    // Normale Höhe
          
          // Normale Skalierung für Desktop
          this.mesh.scale.set(1, 1, 1);
        }
      }
    }
  }
  
  /**
   * Erstellt das Text-Mesh und fügt es zur Szene hinzu
   * @param {THREE.Scene} scene - Die THREE.js-Szene
   * @returns {THREE.Mesh} - Das erstellte Text-Mesh
   */
  createMesh(scene) {
    // Text initial setzen
    this.updateCanvasText();
    
    // Material und Geometrie erstellen
    const textMaterial = new this.THREE.MeshBasicMaterial({ 
      map: this.texture, 
      transparent: true,
      alphaTest: 0.01
    });
    const textGeometry = new this.THREE.PlaneGeometry(4, 2);
    
    // Mesh erstellen und zur Szene hinzufügen
    const textMesh = new this.THREE.Mesh(textGeometry, textMaterial);
    
    // Position setzen
    const mobileX = 0;  // X-Position für Mobile (nach rechts)
    const mobileY = 0; // Y-Position für Mobile (nach oben)
    textMesh.position.set(
      this.isMobile ? mobileX : -0.4, 
      this.isMobile ? mobileY : 0, 
      26.5
    );
    
    // Skalierung anpassen
    if (this.isMobile) {
      textMesh.scale.set(0.65, 0.65, 0.65); // Kleinere Skalierung für Mobile
    }
    
    scene.add(textMesh);
    
    // Referenz speichern
    this.mesh = textMesh;
    
    return textMesh;
  }
  
  /**
   * Startet die regelmäßige Aktualisierung der Begrüßung
   * @param {number} intervalMs - Intervall in Millisekunden
   */
  startUpdateInterval(intervalMs = 2000) {
    // Altes Interval beenden, falls existiert
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Neues Interval starten
    this.updateInterval = setInterval(() => {
      this.currentGreetingIndex = (this.currentGreetingIndex + 1) % this.greetings.length;
      this.updateCanvasText();
    }, intervalMs);
  }
  
  /**
   * Aktualisiert den Canvas-Text mit der aktuellen Begrüßung
   */
  updateCanvasText() {
    console.log("IntroText: updateCanvasText aufgerufen mit isMobile =", this.isMobile);
    
    this.context.clearRect(0, 0, 1024, 512);
    this.context.fillStyle = "rgba(0,0,0,0)";
    this.context.fillRect(0, 0, 1024, 512);
    this.context.textAlign = "left";
    this.context.textBaseline = "middle";
    this.context.imageSmoothingEnabled = false;
    
    // Schatten-Eigenschaften für besseren Kontrast
    this.context.shadowColor = "rgba(0, 0, 0, 0.6)";
    this.context.shadowBlur = 8;
    this.context.shadowOffsetX = 1;
    this.context.shadowOffsetY = 1;
    
    this.context.fillStyle = "white";
    
    let lines;
    
    if (this.isMobile === true) {
      console.log("IntroText: Mobile Text wird verwendet");
      // Mobile: Kürzere Version mit 6 Zeilen
      lines = [
        this.greetings[this.currentGreetingIndex],
        "i'm Franz.",
        "",
        "an interaction-design student",
        "passionated about crafting",
        "intuitive digital experiences."
      ];
    } else {
      console.log("IntroText: Desktop Text wird verwendet");
      // Desktop: Vollständige Version mit 8 Zeilen
      lines = [
        this.greetings[this.currentGreetingIndex],
        "i'm",
        "Franz.",
        "",
        "an interaction-design student passionated",
        "about crafting intuitive and enganging digital",
        "experience, bringing digital worlds to life",
        "through user-centered design."
      ];
    }
    
    // Berechne maximale Textbreite für die Zentrierung
    let maxWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      if ((!this.isMobile && i < 3) || (this.isMobile && i < 2)) {
        this.context.font = "56px 'IBM Plex Mono'";
      } else {
        this.context.font = "32px 'IBM Plex Mono'";
      }
      const w = this.context.measureText(lines[i]).width;
      if (w > maxWidth) maxWidth = w;
    }
    
    // Berechne Rand für horizontale Zentrierung
    const margin = (1024 - maxWidth) / 2;
    
    // Zeichne den Text
    let currentY = this.isMobile ? 90 : 60; // Starte etwas tiefer auf mobilen Geräten
    
    for (let i = 0; i < lines.length; i++) {
      if ((!this.isMobile && i < 3) || (this.isMobile && i < 2)) {
        this.context.font = "56px 'IBM Plex Mono'";
        this.context.fillText(lines[i], margin, currentY);
        currentY += this.isMobile ? 70 : 60;
      } else {
        this.context.font = "32px 'IBM Plex Mono'";
        this.context.fillText(lines[i], margin, currentY);
        currentY += this.isMobile ? 54 : 48;
      }
    }
    
    // Textur aktualisieren
    this.texture.needsUpdate = true;
    
    // Shadow zurücksetzen
    this.context.shadowColor = "transparent";
  }
  
  /**
   * Bereinigt die Ressourcen
   */
  dispose() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.texture) {
      this.texture.dispose();
    }
    
    if (this.mesh && this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }
    
    if (this.mesh && this.mesh.material) {
      this.mesh.material.dispose();
    }
  }
}