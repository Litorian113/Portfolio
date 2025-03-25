export class BackButton {
    constructor(THREE, scene, renderer, camera) {
        this.THREE = THREE;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        // Button-Objekt
        this.button = null;
        
        // Status
        this.isHighlighted = false;
        
        // Button erstellen
        this.createButton();
    }
    
    createButton() {
        // Canvas für den Button erstellen
        const buttonCanvas = document.createElement('canvas');
        const buttonContext = buttonCanvas.getContext('2d');
        buttonCanvas.width = 512; 
        buttonCanvas.height = 256;

        // Button mit Text zeichnen
        buttonContext.fillStyle = "rgba(6, 0, 61, 0.7)"; // Dunkelblau mit leichter Transparenz
        buttonContext.fillRect(0, 0, 512, 256);
        buttonContext.strokeStyle = "rgba(255, 255, 255, 0.8)";
        buttonContext.lineWidth = 4;
        buttonContext.strokeRect(10, 10, 492, 236);

        // Text zeichnen
        buttonContext.font = "bold 40px 'IBM Plex Mono'";
        buttonContext.textAlign = "center";
        buttonContext.textBaseline = "middle";
        buttonContext.fillStyle = "#FFFFFF";
        buttonContext.fillText("Back to Start", 256, 128);

        // Textur erstellen
        const buttonTexture = new this.THREE.CanvasTexture(buttonCanvas);
        buttonTexture.colorSpace = this.THREE.SRGBColorSpace;
        buttonTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        // Button-Mesh erstellen
        const backButtonGeo = new this.THREE.PlaneGeometry(0.5, 0.25);
        const backButtonMat = new this.THREE.MeshBasicMaterial({ 
            map: buttonTexture, 
            transparent: true,
            alphaTest: 0.01,
            depthTest: false // Stellt sicher, dass der Button immer gerendert wird
        });
        
        this.button = new this.THREE.Mesh(backButtonGeo, backButtonMat);
        this.button.position.set(0, 0, -38);
        this.button.name = "backButton";
        this.scene.add(this.button);
    }
    
    // Prüft, ob die Maus über dem Button ist und aktualisiert Cursor und Button-Darstellung
    handleMouseMove(event, container, gsap, rect, x, y) {
        const raycaster = new this.THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        const buttonIntersects = raycaster.intersectObject(this.button);
        
        if (buttonIntersects.length > 0) {
            // Mauszeiger auf Pointer ändern
            container.style.cursor = "pointer";
            
            // Button visuell hervorheben
            if (!this.isHighlighted) {
                this.isHighlighted = true;
                this.button.material.opacity = 1.0;
                gsap.to(this.button.scale, { 
                    x: 1.1, y: 1.1, z: 1.1, 
                    duration: 0.2 
                });
            }
            
            return true; // Signal, dass der Button getroffen wurde
        } 
        else if (this.isHighlighted) {
            // Zurücksetzen, wenn nicht mehr über dem Button
            this.isHighlighted = false;
            this.button.material.opacity = 0.9;
            gsap.to(this.button.scale, { 
                x: 1, y: 1, z: 1, 
                duration: 0.2 
            });
        }
        
        return false;
    }
    
    // Prüft, ob der Button geklickt wurde und führt ggf. die Aktion aus
    handleClick(x, y, navigateToSectionCallback) {
        const raycaster = new this.THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        const buttonIntersects = raycaster.intersectObject(this.button);
        
        if (buttonIntersects.length > 0) {
            console.log("Back to Start Button geklickt");
            navigateToSectionCallback("intro");
            return true; // Button wurde geklickt
        }
        
        return false; // Button wurde nicht geklickt
    }
    
    dispose() {
        if (this.button) {
            if (this.button.geometry) this.button.geometry.dispose();
            if (this.button.material) {
                if (this.button.material.map) this.button.material.map.dispose();
                this.button.material.dispose();
            }
            this.scene.remove(this.button);
            this.button = null;
        }
    }
}