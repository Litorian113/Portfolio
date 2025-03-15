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
}