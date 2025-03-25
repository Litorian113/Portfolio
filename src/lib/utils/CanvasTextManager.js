/**
 * Verwaltet die Canvas-Texturen für verschiedene Abschnitte der Anwendung
 */
export class CanvasTextManager {
    constructor(THREE, renderer) {
        this.THREE = THREE;
        this.renderer = renderer;
        this.typewriter = null;
    }

    /**
     * Setzt die Typewriter-Instanz
     */
    setTypewriter(typewriter) {
        this.typewriter = typewriter;
    }

    /**
     * Hilfsfunktion zur Berechnung responsiver Größen
     */
    getResponsiveSize(baseSize) {
        const baseWidth = 1920;
        const minScale = 0.7;
        let scale = Math.max(window.innerWidth / baseWidth, minScale);
        return Math.floor(baseSize * scale);
    }

    /**
     * Aktualisiert den Canvas für "Design Work"
     */
    updateCanvas1Text(context, texture) {
        if (this.typewriter && context && texture) {
            this.typewriter.updateCanvas1Text(context, texture);
        } else if (context && texture) {
            this.renderDefaultText(context, texture, "Design Work");
        }
    }

    /**
     * Aktualisiert den Canvas für "Code & Data"
     */
    updateCanvas2Text(context, texture) {
        if (this.typewriter && context && texture) {
            this.typewriter.updateCanvas2Text(context, texture);
        } else if (context && texture) {
            this.renderDefaultText(context, texture, "Code & Data");
        }
    }

    /**
     * Aktualisiert den Canvas für "Website Projects"
     */
    updateCanvas3Text(context, texture) {
        if (this.typewriter && context && texture) {
            this.typewriter.updateCanvas3Text(context, texture);
        } else if (context && texture) {
            this.renderDefaultText(context, texture, "Website Projects");
        }
    }

    /**
     * Aktualisiert den Canvas für "Photo & Video"
     */
    updateCanvas4Text(context, texture) {
        if (this.typewriter && context && texture) {
            this.typewriter.updateCanvas4Text(context, texture);
        } else if (context && texture) {
            this.renderDefaultText(context, texture, "Photo & Video");
        }
    }

    /**
     * Aktualisiert den Canvas für "About me"
     */
    updateCanvas5Text(context, texture) {
        if (this.typewriter && context && texture) {
            this.typewriter.updateCanvas5Text(context, texture);
        } else if (context && texture) {
            this.renderDefaultText(context, texture, "About me");
        }
    }

    /**
     * Standardtext-Rendering für die Initialisierung ohne Typewriter-Effekt
     */
    renderDefaultText(context, texture, title) {
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, 1024, 512);
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 5;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        const titleFontSize = this.getResponsiveSize(42);
        context.fillStyle = "rgba(255,255,255,0.4)";
        context.font = `${titleFontSize}px 'IBM Plex Mono'`;
        
        const centerX = 1024 / 4.5;
        const centerY = 512 / 1.25;
        context.fillText(title, centerX, centerY - 50);
        
        context.shadowColor = "transparent";
        texture.needsUpdate = true;
    }

    /**
     * Aktualisiert alle Canvas-Texturen
     */
    updateAllCanvasTexts(contexts, textures) {
        this.updateCanvas1Text(contexts.context1, textures.textTexture1);
        this.updateCanvas2Text(contexts.context2, textures.textTexture2);
        this.updateCanvas3Text(contexts.context3, textures.textTexture3);
        this.updateCanvas4Text(contexts.context4, textures.textTexture4);
        this.updateCanvas5Text(contexts.context5, textures.textTexture5);
    }
}