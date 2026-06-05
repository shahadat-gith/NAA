import { useState } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";
import Button from "../common/Button";

const ImageCropModal = ({ src, visible, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-black text-text-primary">Adjust Profile Picture</h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary border-none bg-transparent cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Live Interactivity Viewport Wireframe */}
        <div className="relative w-full h-80 bg-background">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1} // Strict golden ratio square constraints
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>

        {/* Operational Range Slider Dock */}
        <div className="p-4 space-y-4 bg-card border-t border-border">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest block">Zoom Configuration</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary bg-background h-1 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
            <Button type="button" variant="accent" fullWidth onClick={() => onCropComplete(croppedAreaPixels)}>Apply Crop</Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageCropModal;