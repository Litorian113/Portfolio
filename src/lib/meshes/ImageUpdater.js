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
        
        // Wende die Opazität auf alle Gruppen an
        coverGroups.forEach((group, index) => {
            if (!group.userData.defaultMesh) return;
            
            // Mobile Geräte: Nur die ersten beiden Cover-Gruppen anzeigen (Earthquake und Migrants)
            if (isMobile) {
                const projectName = group.userData.project;
                const isVisibleOnMobile = projectName === 'earthquake' || projectName === 'migrants';
                
                if (!isVisibleOnMobile) {
                    // Unsichtbar machen
                    group.userData.defaultMesh.visible = false;
                    if (group.userData.hoverMesh) {
                        group.userData.hoverMesh.visible = false;
                    }
                    return; // Frühzeitig beenden für unsichtbare Gruppen
                }
                
                // Bei mobilen Geräten vertikal gestaffelt anordnen
                if (projectName === 'earthquake') {
                    gsap.to(group.position, { 
                        x: -0.58, 
                        y: 0.7,  // Obere Position
                        duration: 1.2, 
                        ease: "power1.out" 
                    });
                    // Skalierung für mobile Geräte
                    gsap.to(group.scale, {
                        x: 0.4,
                        y: 0.4,
                        z: 0.4,
                        duration: 1.2,
                        ease: "power1.out"
                    });
                } else if (projectName === 'migrants') {
                    gsap.to(group.position, { 
                        x: -0.58, 
                        y: -0.5,  // Untere Position
                        duration: 1.2, 
                        ease: "power1.out" 
                    });
                    // Skalierung für mobile Geräte
                    gsap.to(group.scale, {
                        x: 0.4,
                        y: 0.4,
                        z: 0.4,
                        duration: 1.2,
                        ease: "power1.out"
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