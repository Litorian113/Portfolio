/**
 * Klasse zur Verwaltung von Klick-Events in der 3D-Szene
 * Identifiziert angeklickte Objekte und führt die entsprechende Navigation aus
 */
export class CanvasClickHandler {
  /**
   * @param {Object} THREE - Die THREE.js-Bibliothek
   * @param {Object} options - Konfigurationsoptionen
   * @param {THREE.Camera} options.camera - Die Kamera
   * @param {Function} options.navigateToProject - Callback-Funktion für die Navigation zu einem Projekt
   * @param {Object} options.gsap - GSAP-Bibliothek für Animationen
   */
  constructor(THREE, options) {
    this.THREE = THREE;
    this.camera = options.camera;
    this.navigateToProject = options.navigateToProject;
    this.gsap = options.gsap; // GSAP-Referenz speichern
    
    // Raycaster für die Objekterkennung
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  /**
   * Verarbeitet ein Klick-Event
   * @param {Event} event - Das Klick-Event
   * @param {Array} coverGroups - Array der Cover-Gruppen
   * @param {Array} imageMeshes - Array der Bild-Meshes
   */
  handleClick(event, coverGroups, imageMeshes) {
    // Normalisierte Mauskoordinaten berechnen
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Überprüfe sowohl Cover-Gruppen als auch die imageMeshes (für einzelne Bilder)
    const clickableObjects = [
      ...coverGroups.map(group => group.userData.defaultMesh),
      ...imageMeshes
    ];
    
    const intersects = this.raycaster.intersectObjects(clickableObjects, false);

    if (intersects.length > 0) {
      const clickedObj = intersects[0].object;
      const projectName = clickedObj.userData.parentGroup ? 
                        clickedObj.userData.parentGroup.userData.project : 
                        clickedObj.userData.project;
      
      // Navigation zum Projekt über den Callback
      if (this.navigateToProject) {
        this.navigateToProject(projectName, this.camera.position);
      }
    }
  }

  /**
   * Hover-Zustand für die Cover-Gruppen aktualisieren
   * @param {Event} event - Das Mousemove-Event
   * @param {Array} coverGroups - Array der Cover-Gruppen
   * @param {Array} imageMeshes - Array der Bild-Meshes
   * @param {HTMLElement} container - Der Container für den Cursor-Stil
   * @returns {boolean} - true wenn Hover aktiv ist
   */
  handleHover(event, coverGroups, imageMeshes, container) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const clickableObjects = [
      ...coverGroups.map(group => group.userData.defaultMesh),
      ...imageMeshes
    ];
    const intersects = this.raycaster.intersectObjects(clickableObjects, false);

    // Cursor-Stil anpassen
    if (intersects.length > 0) {
      const projectName = intersects[0].object.userData.parentGroup ? 
                        intersects[0].object.userData.parentGroup.userData.project : 
                        intersects[0].object.userData.project;
      
      // Liste der klickbaren Projekttypen
      if (['nass', 'bwegt', 'iceAgeMammals', 'hybridWallet', 
          'game', 'earthquake', 'karincruises', 'migrants',
          'photovideo', 'aboutme', 'website1', 'website2'].includes(projectName)) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }
    } else {
      container.style.cursor = 'default';
    }

    // Cover-Gruppen-Hover-Effekt - Verwende this.setCoverGroupState statt externen Parameter
    if (intersects.length === 0) {
      coverGroups.forEach(group => {
        this.setCoverGroupState(group, "default");
      });
    } else {
      const hoveredDefault = intersects[0].object;
      const hoveredGroup = hoveredDefault.userData.parentGroup;
      coverGroups.forEach(group => {
        if (group === hoveredGroup) {
          this.setCoverGroupState(group, "hover");
        } else {
          this.setCoverGroupState(group, "gray");
        }
      });
    }

    return intersects.length > 0;
  }

  /**
   * Setzt den Zustand einer Cover-Gruppe
   * @param {THREE.Group} group - Die Cover-Gruppe
   * @param {string} state - Der Zustand ("hover", "gray" oder "default")
   */
  setCoverGroupState(group, state) {
    if (!this.gsap || !group.userData.hoverMesh || !group.userData.defaultMesh) return;
    
    if (state === "hover") {
      this.gsap.to(group.userData.hoverMesh.material, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
      this.gsap.to(group.userData.defaultMesh.material, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
      this.gsap.to(group.userData.defaultMesh.material.color, { r: 1, g: 1, b: 1, duration: 0.6, ease: "power1.inOut" });
    } else if (state === "gray") {
      this.gsap.to(group.userData.hoverMesh.material, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
      this.gsap.to(group.userData.defaultMesh.material, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
      this.gsap.to(group.userData.defaultMesh.material.color, { r: 0.3, g: 0.3, b: 0.3, duration: 0.6, ease: "power1.inOut" });
    } else if (state === "default") {
      this.gsap.to(group.userData.hoverMesh.material, { opacity: 0, duration: 0.6, ease: "power1.inOut" });
      this.gsap.to(group.userData.defaultMesh.material, { opacity: 1, duration: 0.6, ease: "power1.inOut" });
      this.gsap.to(group.userData.defaultMesh.material.color, { r: 1, g: 1, b: 1, duration: 0.6, ease: "power1.inOut" });
    }
  }
}