import { MapAdapter } from '../ports';

// Simple mock map implementation using HTML divs
// TODO: Replace with Mapbox/Google Maps implementation
export class SimpleMockMapAdapter implements MapAdapter {
  private container: HTMLElement | null = null;
  private onMarkerClickCallback?: (id: string) => void;

  mount(container: HTMLElement, opts: { center: [number, number]; zoom: number }): void {
    this.container = container;
    
    // Create mock map container
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.backgroundColor = '#e5f3ff';
    container.style.border = '2px solid #3b82f6';
    container.style.borderRadius = '8px';
    container.style.overflow = 'hidden';
    
    // Add mock map grid lines
    const gridOverlay = document.createElement('div');
    gridOverlay.style.position = 'absolute';
    gridOverlay.style.top = '0';
    gridOverlay.style.left = '0';
    gridOverlay.style.width = '100%';
    gridOverlay.style.height = '100%';
    gridOverlay.style.backgroundImage = `
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
    `;
    gridOverlay.style.backgroundSize = '40px 40px';
    container.appendChild(gridOverlay);
    
    // Add map info
    const mapInfo = document.createElement('div');
    mapInfo.style.position = 'absolute';
    mapInfo.style.top = '10px';
    mapInfo.style.left = '10px';
    mapInfo.style.background = 'rgba(255, 255, 255, 0.9)';
    mapInfo.style.padding = '8px 12px';
    mapInfo.style.borderRadius = '4px';
    mapInfo.style.fontSize = '12px';
    mapInfo.style.fontWeight = 'bold';
    mapInfo.style.color = '#374151';
    mapInfo.textContent = `Mock Map - Center: [${opts.center[0]}, ${opts.center[1]}] Zoom: ${opts.zoom}`;
    container.appendChild(mapInfo);
  }

  setMarkers(items: { id: string; lat: number; lng: number; label: string }[]): void {
    if (!this.container) return;
    
    // Remove existing markers
    const existingMarkers = this.container.querySelectorAll('.mock-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add new markers
    items.forEach((item, index) => {
      const marker = document.createElement('div');
      marker.className = 'mock-marker';
      marker.style.position = 'absolute';
      marker.style.width = '32px';
      marker.style.height = '32px';
      marker.style.backgroundColor = '#ef4444';
      marker.style.borderRadius = '50% 50% 50% 0';
      marker.style.border = '3px solid #ffffff';
      marker.style.cursor = 'pointer';
      marker.style.transform = 'rotate(-45deg)';
      marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      marker.style.zIndex = '10';
      
      // Position markers in a grid pattern for mock purposes
      const gridSize = Math.ceil(Math.sqrt(items.length));
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const x = (col + 1) * (this.container!.offsetWidth / (gridSize + 1)) - 16;
      const y = (row + 1) * (this.container!.offsetHeight / (gridSize + 1)) - 16;
      
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      
      // Add marker label
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.top = '32px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%) rotate(45deg)';
      label.style.background = 'rgba(0, 0, 0, 0.8)';
      label.style.color = 'white';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '4px';
      label.style.fontSize = '10px';
      label.style.whiteSpace = 'nowrap';
      label.style.pointerEvents = 'none';
      label.textContent = item.label;
      marker.appendChild(label);
      
      // Add click handler
      marker.addEventListener('click', () => {
        if (this.onMarkerClickCallback) {
          this.onMarkerClickCallback(item.id);
        }
      });
      
      // Add hover effect
      marker.addEventListener('mouseenter', () => {
        marker.style.transform = 'rotate(-45deg) scale(1.1)';
        marker.style.zIndex = '20';
      });
      
      marker.addEventListener('mouseleave', () => {
        marker.style.transform = 'rotate(-45deg) scale(1)';
        marker.style.zIndex = '10';
      });
      
      this.container!.appendChild(marker);
    });
  }

  onMarkerClick(cb: (id: string) => void): void {
    this.onMarkerClickCallback = cb;
  }

  destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
    this.onMarkerClickCallback = undefined;
  }
}
