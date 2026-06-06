import React, { useState } from "react";
import { Plus, Image as ImageIcon, Edit2 } from "lucide-react";

import EditBannerModal from "./EditBannerModal";

const MAX_IMAGES = 12;

const BannerImagesTab = ({ heroImages = [], loading }) => {
  const [editingImage, setEditingImage] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const images = heroImages || [];

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Banner Images</h3>
          </div>
        </div>

        <button
          onClick={() => canAddMore && setIsAddMode(true)}
          disabled={!canAddMore}
          className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] disabled:bg-gray-400 text-white rounded-2xl font-medium transition-all text-sm"
        >
          Add
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[var(--text-secondary)]">
          Loading banner images...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-default)] rounded-3xl">
          <ImageIcon size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)]">No banner images yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Add up to {MAX_IMAGES} images for the homepage carousel</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative bg-[var(--bg-base)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Edit Button */}
              <button
                onClick={() => setEditingImage(img)}
                className="absolute top-4 right-4 p-2.5 bg-black/70 hover:bg-black/90 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <Edit2 size={18} />
              </button>

              <img
                src={img.url}
                alt="Banner"
                className="w-full aspect-video object-cover"
              />

              <div className="p-4 text-sm text-[var(--text-secondary)]">
                Banner #{images.indexOf(img) + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      <EditBannerModal
        open={!!editingImage || isAddMode}
        image={editingImage}
        isAddMode={isAddMode}
        onClose={() => {
          setEditingImage(null);
          setIsAddMode(false);
        }}
      />
    </div>
  );
};

export default BannerImagesTab;