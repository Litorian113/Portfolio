/**
 * Klasse zur Verwaltung von Typewriter-Effekten für Canvas-basierte Texte
 */
export class Typewriter {
    constructor() {
        this.typingInProgress = false;
        this.subtitleProgress = [0, 0, 0, 0, 0]; // Fortschritt für alle 5 Stationen
        this.titleOpacities = [0.4, 0.4, 0.4, 0.4, 0.4]; // Standard-Opacity für Überschriften
        this.subtitleOpacities = [1, 1, 1, 1, 1]; // Opacity für jeden Untertext
        this.previousStation = -1;

        this.subtitleTexts = [
            ['A selection of interaction design projects', 'created during my studies at HfG Schwäbisch Gmünd.'],
            ['A collection of coded projects from my', 'studies and personal explorations.'],
            ['Freelance web projects developed for', 'small and medium-sized businesses.'],
            ['Visual work from years of experience as a', 'professional photographer, spanning commercial', 'and personal projects.'],
            ['A glimpse into who I am and', 'what drives my creative journey.']
        ];
    }

    /**
     * Aktualisiert die Titel-Opazitäten und startet den Typewriter-Effekt
     */
    updateTitleOpacitiesAndStartTyping(currentStation, contexts, textures) {
        // Mapping der Kamerastationen zu den zugehörigen Titel-Indizes
        const stationToTitleMap = [
            { station: 1, titleIndex: 0 },  // Design Work
            { station: 6, titleIndex: 1 },  // Code & Data
            { station: 8, titleIndex: 2 },  // Website Projects
            { station: 10, titleIndex: 3 }, // Photo & Video
            { station: 12, titleIndex: 4 }  // About me
        ];

        // Findet den aktuell aktiven Titelindex basierend auf der Station
        const activeMatch = stationToTitleMap.find(item => item.station === currentStation);
        const activeIndex = activeMatch ? activeMatch.titleIndex : -1;
        
        // Aktualisiere alle Title-Opacities
        for (let i = 0; i < this.titleOpacities.length; i++) {
            this.titleOpacities[i] = (i === activeIndex) ? 1.0 : 0.4;
        }
        
        // Stationswechsel erkennen
        if (this.previousStation !== currentStation) {
            // Station wurde gewechselt
            console.log(`Station gewechselt: ${this.previousStation} -> ${currentStation}`);
            
            // 1. Alten Typewriter stoppen
            this.typingInProgress = false;
            
            // 2. Alle vorherigen Untertitel ausblenden
            const prevMatch = stationToTitleMap.find(item => item.station === this.previousStation);
            if (prevMatch) {
                const prevIndex = prevMatch.titleIndex;
                this.subtitleOpacities[prevIndex] = 0;
                this.subtitleProgress[prevIndex] = 0;
            }
            
            // 3. Wenn eine aktive Station vorhanden ist
            if (activeIndex >= 0) {
                this.subtitleOpacities[activeIndex] = 1;
                this.subtitleProgress[activeIndex] = 0;
                
                // Mit leichter Verzögerung den Typewriter starten
                setTimeout(() => {
                    if (currentStation === stationToTitleMap.find(item => item.titleIndex === activeIndex)?.station) {
                        this.startTypewriterEffect(activeIndex, contexts, textures);
                    }
                }, 300);
            }
            
            this.previousStation = currentStation;
        } 
        // Wenn keine Station gewechselt wurde, aber der Text noch nicht gestartet ist
        else if (activeIndex >= 0 && this.subtitleProgress[activeIndex] === 0 && !this.typingInProgress) {
            this.startTypewriterEffect(activeIndex, contexts, textures);
        }
        
        // Alle Canvas-Texte aktualisieren
        this.updateAllCanvasTexts(contexts, textures);
    }

    /**
     * Startet den Typewriter-Effekt für einen bestimmten Abschnitt
     */
    startTypewriterEffect(sectionIndex, contexts, textures) {
        this.typingInProgress = true;
        
        // Gesamtlänge des zu schreibenden Textes
        const totalLength = this.subtitleTexts[sectionIndex].reduce((sum, text) => sum + text.length, 0);
        
        // Fortschritt zurücksetzen
        this.subtitleProgress[sectionIndex] = 0;
        
        // Typing starten
        this.typeNextCharacter(sectionIndex, totalLength, contexts, textures);
    }

    /**
     * Schreibt das nächste Zeichen im Typewriter-Effekt
     */
    typeNextCharacter(sectionIndex, totalLength, contexts, textures) {
        if (this.subtitleProgress[sectionIndex] < totalLength) {
            this.subtitleProgress[sectionIndex]++;
            
            // Aktualisiere den entsprechenden Canvas
            this.updateAllCanvasTexts(contexts, textures);
            
            // Zufällige Verzögerung für realistischeren Typewriter-Effekt
            const delay = 20 + Math.random() * 30;
            setTimeout(() => this.typeNextCharacter(sectionIndex, totalLength, contexts, textures), delay);
        } else {
            this.typingInProgress = false;
        }
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
        if (!context || !texture) return;
        
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, 1024, 512);
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        // Schatten-Eigenschaften für Titel
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 5;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        // Hauptüberschrift mit dynamischer Opacity
        const titleFontSize = this.getResponsiveSize(42);
        const subtitleFontSize = this.getResponsiveSize(24);
        context.fillStyle = `rgba(255,255,255,${this.titleOpacities[0]})`;
        context.font = `${titleFontSize}px 'IBM Plex Mono'`;
        
        const centerX = 1024 / 4.5;
        const centerY = 512 / 1.25;
        
        context.fillText("Design Work", centerX, centerY - 50);
        
        // Untertext mit Typewriter-Effekt und Opacity
        context.fillStyle = `rgba(255,255,255,${this.subtitleOpacities[0]})`;
        context.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
        
        const subtitle1 = this.subtitleTexts[0][0].substring(0, this.subtitleProgress[0]);
        context.fillText(subtitle1, centerX, centerY);
        
        if (this.subtitleProgress[0] >= this.subtitleTexts[0][0].length) {
            const subtitle2 = this.subtitleTexts[0][1].substring(0, this.subtitleProgress[0] - this.subtitleTexts[0][0].length);
            context.fillText(subtitle2, centerX, centerY + 35);
        }
        
        context.shadowColor = "transparent";
        texture.needsUpdate = true;
    }

    /**
     * Aktualisiert den Canvas für "Code & Data"
     */
    updateCanvas2Text(context, texture) {
        if (!context || !texture) return;
        
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, 1024, 512);
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        // Schatten-Eigenschaften für Titel
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 5;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        // Hauptüberschrift mit dynamischer Opacity
        const titleFontSize = this.getResponsiveSize(42);
        const subtitleFontSize = this.getResponsiveSize(24);
        context.fillStyle = `rgba(255,255,255,${this.titleOpacities[1]})`;
        context.font = `${titleFontSize}px 'IBM Plex Mono'`;
        
        const centerX = 1024 / 4.5;
        const centerY = 512 / 1.25;
        
        context.fillText("Code & Data", centerX, centerY - 50);
        
        // Untertext mit Typewriter-Effekt und Opacity
        context.fillStyle = `rgba(255,255,255,${this.subtitleOpacities[1]})`;
        context.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
        
        const subtitle1 = this.subtitleTexts[1][0].substring(0, this.subtitleProgress[1]);
        context.fillText(subtitle1, centerX, centerY);
        
        if (this.subtitleProgress[1] >= this.subtitleTexts[1][0].length) {
            const subtitle2 = this.subtitleTexts[1][1].substring(0, this.subtitleProgress[1] - this.subtitleTexts[1][0].length);
            context.fillText(subtitle2, centerX, centerY + 35);
        }
        
        context.shadowColor = "transparent";
        texture.needsUpdate = true;
    }

    /**
     * Aktualisiert den Canvas für "Website Projects"
     */
    updateCanvas3Text(context, texture) {
        if (!context || !texture) return;
        
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, 1024, 512);
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        // Schatten-Eigenschaften für Titel
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 5;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        // Hauptüberschrift mit dynamischer Opacity
        const titleFontSize = this.getResponsiveSize(42);
        const subtitleFontSize = this.getResponsiveSize(24);
        context.fillStyle = `rgba(255,255,255,${this.titleOpacities[2]})`;
        context.font = `${titleFontSize}px 'IBM Plex Mono'`;
        
        const centerX = 1024 / 4.5;
        const centerY = 512 / 1.25;
        
        context.fillText("Website Projects", centerX, centerY - 50);
        
        // Untertext mit Typewriter-Effekt und Opacity
        context.fillStyle = `rgba(255,255,255,${this.subtitleOpacities[2]})`;
        context.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
        
        const subtitle1 = this.subtitleTexts[2][0].substring(0, this.subtitleProgress[2]);
        context.fillText(subtitle1, centerX, centerY);
        
        if (this.subtitleProgress[2] >= this.subtitleTexts[2][0].length) {
            const subtitle2 = this.subtitleTexts[2][1].substring(0, this.subtitleProgress[2] - this.subtitleTexts[2][0].length);
            context.fillText(subtitle2, centerX, centerY + 35);
        }
        
        context.shadowColor = "transparent";
        texture.needsUpdate = true;
    }

    /**
     * Aktualisiert den Canvas für "Photo & Video"
     */
    updateCanvas4Text(context, texture) {
        if (!context || !texture) return;
        
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, 1024, 512);
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        // Schatten-Eigenschaften für Titel
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 5;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        // Hauptüberschrift mit dynamischer Opacity
        const titleFontSize = this.getResponsiveSize(42);
        const subtitleFontSize = this.getResponsiveSize(24);
        context.fillStyle = `rgba(255,255,255,${this.titleOpacities[3]})`;
        context.font = `${titleFontSize}px 'IBM Plex Mono'`;
        
        const centerX = 1024 / 4.5;
        const centerY = 512 / 1.25;
        
        context.fillText("Photo & Video", centerX, centerY - 50);
        
        // Untertext mit Typewriter-Effekt und Opacity
        context.fillStyle = `rgba(255,255,255,${this.subtitleOpacities[3]})`;
        context.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
        
        const subtitle1 = this.subtitleTexts[3][0].substring(0, this.subtitleProgress[3]);
        context.fillText(subtitle1, centerX, centerY);
        
        if (this.subtitleProgress[3] >= this.subtitleTexts[3][0].length) {
            const subtitle2 = this.subtitleTexts[3][1].substring(0, this.subtitleProgress[3] - this.subtitleTexts[3][0].length);
            context.fillText(subtitle2, centerX, centerY + 35);
            
            // Dritte Zeile für Photo & Video
            if (this.subtitleProgress[3] >= this.subtitleTexts[3][0].length + this.subtitleTexts[3][1].length) {
                const subtitle3 = this.subtitleTexts[3][2].substring(0, this.subtitleProgress[3] - this.subtitleTexts[3][0].length - this.subtitleTexts[3][1].length);
                context.fillText(subtitle3, centerX, centerY + 70);
            }
        }
        
        context.shadowColor = "transparent";
        texture.needsUpdate = true;
    }

    /**
     * Aktualisiert den Canvas für "About me"
     */
    updateCanvas5Text(context, texture) {
        if (!context || !texture) return;
        
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, 1024, 512);
        context.textAlign = "left";
        context.textBaseline = "middle";
        
        // Schatten-Eigenschaften für Titel
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 5;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        // Hauptüberschrift mit dynamischer Opacity
        const titleFontSize = this.getResponsiveSize(42);
        const subtitleFontSize = this.getResponsiveSize(24);
        context.fillStyle = `rgba(255,255,255,${this.titleOpacities[4]})`;
        context.font = `${titleFontSize}px 'IBM Plex Mono'`;
        
        const centerX = 1024 / 4.5;
        const centerY = 512 / 1.25;
        
        context.fillText("About me", centerX, centerY - 50);
        
        // Untertext mit Typewriter-Effekt und Opacity
        context.fillStyle = `rgba(255,255,255,${this.subtitleOpacities[4]})`;
        context.font = `${subtitleFontSize}px 'IBM Plex Mono'`;
        
        const subtitle1 = this.subtitleTexts[4][0].substring(0, this.subtitleProgress[4]);
        context.fillText(subtitle1, centerX, centerY);
        
        if (this.subtitleProgress[4] >= this.subtitleTexts[4][0].length) {
            const subtitle2 = this.subtitleTexts[4][1].substring(0, this.subtitleProgress[4] - this.subtitleTexts[4][0].length);
            context.fillText(subtitle2, centerX, centerY + 35);
        }
        
        context.shadowColor = "transparent";
        texture.needsUpdate = true;
    }
}