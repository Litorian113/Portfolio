import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Klasse zum Aktualisieren von Bild-Meshes basierend auf Kameraposition
 */
export class ImageUpdater {
    /**
     * Aktualisiert die Opazität aller Bilder basierend auf Distanz zur Kamera
     */
    static updateAllImages(camera, imageMeshes) {
        const dMin = 2;
        const dMax = 20;
        imageMeshes.forEach(mesh => {
            const dist = Math.abs(camera.position.z - mesh.position.z);
            let opacity;
            if (dist <= dMin) {
                opacity = 1;
            } else if (dist >= dMax) {
                opacity = 0;
            } else {
                const t = (dist - dMin) / (dMax - dMin);
                opacity = 0.7 - t * (1 - 0.1);
            }
            mesh.material.opacity = opacity;
        });
    }

    /**
     * Filtert bestimmte Bild-Meshes auf mobilen Geräten aus
     * Wird nach updateAllImages aufgerufen
     */
    static filterMobileImages(imageMeshes) {
        // Prüfen, ob wir auf einem mobilen Gerät sind
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            console.log("Filterung für mobile Geräte aktiv");
            
            imageMeshes.forEach(mesh => {
                if (!mesh || !mesh.userData) return;
                
                const projectName = mesh.userData.project;
                console.log(`Prüfe Image-Mesh: ${projectName}`);
                
                // Wenn das Projekt "website2" ist, ausblenden
                if (projectName === 'website2') {
                    console.log("Blende website2 für mobile Geräte aus");
                    mesh.visible = false;
                }
                
                // Position und Skalierung von website1 anpassen
                if (projectName === 'website1') {
                    console.log("Positioniere website1 für mobile Geräte");
                    
                    // Mesh direkt manipulieren - ohne gsap für direktes Setzen
                    mesh.position.x = 0; // Mittig positionieren
                    mesh.position.y = 0; 
                    
                    // Skalierung anpassen
                    mesh.scale.set(0.45, 0.45, 0.45);  // Etwas kleiner als Standard
                }
            });
        }
    }

    /**
     * Aktualisiert die X-Position aller Bilder basierend auf Distanz zur Kamera
     */
    static updateImagePositions(camera, imageMeshes, gsap) {
        const threshold = 3;
        imageMeshes.forEach(mesh => {
            const dist = Math.abs(camera.position.z - mesh.position.z);
            if (dist < threshold) {
                gsap.to(mesh.position, { x: mesh.userData.finalX, duration: 1.2, ease: "power1.out" });
            } else {
                gsap.to(mesh.position, { x: mesh.userData.offscreenX, duration: 1.2, ease: "power1.out" });
            }
        });
    }

    /**
     * Aktualisiert die X-Position aller Cover-Gruppen basierend auf Distanz zur Kamera
     */
    static updateCoverGroupPositions(camera, coverGroups, gsap) {
        const threshold = 3;
        coverGroups.forEach(group => {
            const dist = Math.abs(camera.position.z - group.position.z);
            if (dist < threshold) {
                gsap.to(group.position, { x: group.userData.finalX, duration: 1.2, ease: "power1.out" });
            } else {
                gsap.to(group.position, { x: group.userData.offscreenX, duration: 1.2, ease: "power1.out" });
            }
        });
    }

    static updateCoverGroupOpacity(camera, coverGroups) {
        if (!coverGroups || coverGroups.length === 0) return;
        
        // Bereichsdefinitionen für sanftes Überblenden
        const fullVisibilityRange = { min: -8, max: 1 };     // Bereich voller Sichtbarkeit
        const fadeInRange = { min: 1, max: 4 };              // Einblendbereich (beim Reingehen)
        const fadeOutRange = { min: -11, max: -8 };          // Ausblendbereich (beim Verlassen)
        
        // Kameraposition
        const camZ = camera.position.z;
        
        // Opazitätsberechnung
        let opacity = 0;
        
        // Volle Sichtbarkeit im Hauptbereich
        if (camZ >= fullVisibilityRange.min && camZ <= fullVisibilityRange.max) {
            opacity = 1.0;
        } 
        // Einblenden beim Betreten
        else if (camZ > fullVisibilityRange.max && camZ < fadeInRange.max) {
            // Berechne Übergangsfortschritt (0-1)
            const t = 1 - ((camZ - fullVisibilityRange.max) / (fadeInRange.max - fullVisibilityRange.max));
            opacity = Math.max(0, Math.min(1, t)); // Auf Bereich 0-1 begrenzen
        }
        // Ausblenden beim Verlassen
        else if (camZ < fullVisibilityRange.min && camZ > fadeOutRange.min) {
            // Berechne Übergangsfortschritt (0-1)
            const t = (camZ - fadeOutRange.min) / (fullVisibilityRange.min - fadeOutRange.min);
            opacity = Math.max(0, Math.min(1, t)); // Auf Bereich 0-1 begrenzen
        }
        
        // Ist das Gerät ein Mobilgerät?
        const isMobile = window.innerWidth <= 768;
        
        // Debug-Ausgabe für alle Projektgruppen (temporär)
        if (isMobile) {
            console.log("Mobile Ansicht aktiv, vorhandene Projekte:");
            coverGroups.forEach(group => {
                console.log(`Projekt: ${group.userData.project}`);
            });
        }
        
        // Wende die Opazität auf alle Gruppen an
        coverGroups.forEach((group, index) => {
            if (!group.userData.defaultMesh) return;
            
            // Mobile Geräte: Nur ausgewählte Projekte anzeigen
            if (isMobile) {
                const projectName = group.userData.project;
                console.log(`Verarbeite Projekt: ${projectName}`);
                
                // WICHTIG: Nur diese drei Projekte anzeigen, ALLES andere ausblenden
                const isVisibleOnMobile = 
                    projectName === 'earthquake' || 
                    projectName === 'migrants' || 
                    projectName === 'website1';
                
                // Wenn NICHT eines der sichtbaren Projekte, dann ausblenden
                if (!isVisibleOnMobile) {
                    console.log(`Blende Projekt aus: ${projectName}`);
                    // Unsichtbar machen
                    group.userData.defaultMesh.visible = false;
                    if (group.userData.hoverMesh) {
                        group.userData.hoverMesh.visible = false;
                    }
                    return; // Frühzeitig beenden für unsichtbare Gruppen
                }
                
                // Positionierung der sichtbaren Projekte
                if (projectName === 'earthquake') {
                    gsap.to(group.position, { 
                        x: -0.58, 
                        y: 0.7,
                        duration: 1.2, 
                        ease: "power1.out" 
                    });
                    gsap.to(group.scale, {
                        x: 0.4, y: 0.4, z: 0.4,
                        duration: 1.2, ease: "power1.out"
                    });
                } else if (projectName === 'migrants') {
                    gsap.to(group.position, { 
                        x: -0.58, 
                        y: -0.5,
                        duration: 1.2, 
                        ease: "power1.out" 
                    });
                    gsap.to(group.scale, {
                        x: 0.4, y: 0.4, z: 0.4,
                        duration: 1.2, ease: "power1.out"
                    });
                } else if (projectName === 'website1') {
                    gsap.to(group.position, { 
                        x: -0.58, 
                        y: 0,  // Eigene Position zwischen den anderen beiden
                        duration: 1.2, 
                        ease: "power1.out" 
                    });
                    gsap.to(group.scale, {
                        x: 0.4, y: 0.4, z: 0.4,
                        duration: 1.2, ease: "power1.out"
                    });
                }
            }
            
            // Normale Opazitätssteuerung für sichtbare Gruppen
            // DefaultMesh aktualisieren
            if (group.userData.defaultMesh.material) {
                if (!group.userData.defaultMesh.material.transparent) {
                    group.userData.defaultMesh.material.transparent = true;
                }
                
                group.userData.defaultMesh.material.opacity = opacity;
                group.userData.defaultMesh.visible = opacity > 0;
            }
            
            // HoverMesh aktualisieren
            if (group.userData.hoverMesh && group.userData.hoverMesh.material) {
                if (!group.userData.hoverMesh.material.transparent) {
                    group.userData.hoverMesh.material.transparent = true;
                }
                
                if (group.userData.hoverMesh.material.opacity <= 0.5) {
                    group.userData.hoverMesh.material.opacity = 0;
                    group.userData.hoverMesh.visible = opacity > 0;
                }
            }
        });
    }
}