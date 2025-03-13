// /src/lib/meshes/ProjectMeshFactory.js
import * as THREE from 'three';

export class ProjectMeshFactory {
  constructor(scene, isMobile = false) {
    this.scene = scene;
    this.isMobile = isMobile;
    this.textureLoader = new THREE.TextureLoader();
    this.meshes = [];
  }

  // Aktualisiert die mobile Einstellung und passt alle Meshes an
  setMobileMode(isMobile) {
    this.isMobile = isMobile;
    this.updateAllMeshes();
  }

  // Erstellt ein neues Projektmesh
  createProjectMesh(config) {
    const { texturePath, position, project, finalX, offscreenX } = config;
    
    const texture = this.textureLoader.load(this.getTexturePath(texturePath, project));
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Responsive Mesh-Größe basierend auf Mobilstatus
    const aspectRatio = this.isMobile ? 9/16 : 3/2;
    const width = this.isMobile ? 2 : 3;
    const height = this.isMobile ? 2 * (16/9) : 2;
    
    // Position und andere Eigenschaften basierend auf Mobilstatus anpassen
    const pos = { ...position };
    if (this.isMobile) {
      pos.y = position.mobileY || position.y + 0.5;
    }
    
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      toneMapped: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    
    // Mobile und Desktop-spezifische Eigenschaften speichern
    mesh.userData = {
      project,
      finalX: finalX || 0,
      offscreenX: offscreenX || pos.x,
      mobile: {
        position: { 
          x: config.mobilePosition?.x || pos.x, 
          y: config.mobilePosition?.y || (position.y + 0.5),
          z: config.mobilePosition?.z || pos.z 
        },
        scale: config.mobileScale || { x: 0.9, y: 0.9, z: 0.9 },
        finalX: config.mobileFinalX || 0,
        offscreenX: config.mobileOffscreenX || (config.mobilePosition?.x || pos.x)
      },
      desktop: {
        position: { x: pos.x, y: position.y, z: pos.z },
        scale: { x: 1, y: 1, z: 1 },
        finalX,
        offscreenX
      }
    };
    
    // Mobile Anpassungen sofort anwenden, wenn nötig
    if (this.isMobile) {
      mesh.scale.set(
        mesh.userData.mobile.scale.x,
        mesh.userData.mobile.scale.y,
        mesh.userData.mobile.scale.z
      );
    }
    
    this.scene.add(mesh);
    this.meshes.push(mesh);
    
    return mesh;
  }
  
  // Hilfsmethode zum Bestimmen des korrekten Texturpfads
  getTexturePath(texturePath, project) {
    // Falls unterschiedliche Texturen für Desktop/Mobile verwendet werden sollen
    if (typeof texturePath === 'object') {
      return this.isMobile ? texturePath.mobile : texturePath.desktop;
    }
    
    // Standardmäßig mobile Texturpfade für bestimmte Projekte ersetzen
    if (this.isMobile) {
      // Mapping für Mobile-Texturpfade
      const mobileMappings = {
        'nass': '/mobile/Bild1-mobile.png',
        'bwegt': '/mobile/Bild2-mobile.png',
        'iceAgeMammals': '/mobile/Bild3-mobile.png',
        'hybridWallet': '/mobile/Bild4-mobile.png'
      };
      
      if (mobileMappings[project]) {
        return mobileMappings[project];
      }
    }
    
    return texturePath;
  }
  
  // Aktualisiert alle Meshes bei Änderung des Mobile-Status
  updateAllMeshes() {
    this.meshes.forEach(mesh => this.updateMesh(mesh));
  }
  
  // Aktualisiert ein einzelnes Mesh basierend auf dem Mobile-Status
  updateMesh(mesh) {
    const config = this.isMobile ? mesh.userData.mobile : mesh.userData.desktop;
    
    // Position aktualisieren
    mesh.position.set(config.position.x, config.position.y, config.position.z);
    
    // Skalierung aktualisieren
    mesh.scale.set(config.scale.x, config.scale.y, config.scale.z);
    
    // Interaktionsdaten aktualisieren
    mesh.userData.finalX = config.finalX;
    mesh.userData.offscreenX = config.offscreenX;
    
    // Textur aktualisieren (falls nötig)
    if (mesh.userData.project) {
      const newTexturePath = this.getTexturePath(mesh.userData.texturePath, mesh.userData.project);
      if (newTexturePath !== mesh.userData.currentTexturePath) {
        this.textureLoader.load(newTexturePath, (newTexture) => {
          newTexture.colorSpace = THREE.SRGBColorSpace;
          
          // Wenn mobile, ändere auch die Geometrie
          if (this.isMobile) {
            // Alte Resourcen entfernen
            mesh.geometry.dispose();
            if (mesh.material.map) mesh.material.map.dispose();
            mesh.material.dispose();
            
            // Neue Geometrie mit 9:16 Verhältnis
            mesh.geometry = new THREE.PlaneGeometry(2, 2 * (16/9));
            mesh.material = new THREE.MeshBasicMaterial({
              map: newTexture,
              transparent: true,
              toneMapped: false
            });
          } else {
            // Nur die Textur aktualisieren
            mesh.geometry.dispose();
            if (mesh.material.map) mesh.material.map.dispose();
            mesh.material.dispose();
            
            // Neue Geometrie mit 3:2 Verhältnis
            mesh.geometry = new THREE.PlaneGeometry(3, 2);
            mesh.material = new THREE.MeshBasicMaterial({
              map: newTexture,
              transparent: true,
              toneMapped: false
            });
          }
          
          mesh.userData.currentTexturePath = newTexturePath;
        });
      }
    }
  }
}