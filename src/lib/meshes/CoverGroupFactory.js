// /src/lib/meshes/CoverGroupFactory.js
import * as THREE from 'three';

export class CoverGroupFactory {
  constructor(scene, isMobile = false) {
    this.scene = scene;
    this.isMobile = isMobile;
    this.textureLoader = new THREE.TextureLoader();
    this.coverGroups = [];
  }

  setMobileMode(isMobile) {
    this.isMobile = isMobile;
    this.updateAllCoverGroups();
  }

  createCoverGroup(config) {
    const { 
      defaultTexPath, 
      hoverTexPath, 
      position, 
      project,
      finalX, 
      offscreenX,
      scale = 0.6
    } = config;
    
    // Textures laden
    const defaultTex = this.textureLoader.load(defaultTexPath);
    defaultTex.colorSpace = THREE.SRGBColorSpace;
    
    const hoverTex = this.textureLoader.load(hoverTexPath);
    hoverTex.colorSpace = THREE.SRGBColorSpace;
    
    // Group erstellen
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    
    // Position und Skalierung basierend auf Mobile-Status
    const groupScale = this.isMobile ? 
      (config.mobileScale || scale * 0.9) : scale;
    
    group.scale.set(groupScale, groupScale, groupScale);
    
    // Geometrie und Materialien
    const geom = new THREE.PlaneGeometry(3, 2);
    
    const defaultMat = new THREE.MeshBasicMaterial({
      map: defaultTex,
      transparent: true,
      toneMapped: false,
      opacity: 1,
      color: 0xffffff
    });
    
    const defaultMesh = new THREE.Mesh(geom, defaultMat);
    
    const hoverMat = new THREE.MeshBasicMaterial({
      map: hoverTex,
      transparent: true,
      toneMapped: false,
      opacity: 0,
      color: 0xffffff
    });
    
    const hoverMesh = new THREE.Mesh(geom, hoverMat);
    
    // Zur Gruppe hinzufügen
    group.add(defaultMesh);
    group.add(hoverMesh);
    
    // Mobile- und Desktop-spezifische Daten
    group.userData = {
      project,
      defaultMesh,
      hoverMesh,
      finalX,
      offscreenX,
      mobile: {
        position: config.mobilePosition || { 
          x: position.x, 
          y: position.y + 0.2, 
          z: position.z 
        },
        scale: { 
          x: config.mobileScale || scale * 0.9, 
          y: config.mobileScale || scale * 0.9, 
          z: config.mobileScale || scale * 0.9 
        },
        finalX: config.mobileFinalX || finalX,
        offscreenX: config.mobileOffscreenX || offscreenX
      },
      desktop: {
        position: { x: position.x, y: position.y, z: position.z },
        scale: { x: scale, y: scale, z: scale },
        finalX,
        offscreenX
      }
    };
    
    // Für den Raycast einen Verweis im defaultMesh
    defaultMesh.userData.parentGroup = group;
    
    this.scene.add(group);
    this.coverGroups.push(group);
    
    return group;
  }
  
  updateAllCoverGroups() {
    this.coverGroups.forEach(group => this.updateCoverGroup(group));
  }
  
  updateCoverGroup(group) {
    const config = this.isMobile ? group.userData.mobile : group.userData.desktop;
    
    // Position aktualisieren
    group.position.set(config.position.x, config.position.y, config.position.z);
    
    // Skalierung aktualisieren
    group.scale.set(config.scale.x, config.scale.y, config.scale.z);
    
    // Interaktionsdaten aktualisieren
    group.userData.finalX = config.finalX;
    group.userData.offscreenX = config.offscreenX;
  }
}