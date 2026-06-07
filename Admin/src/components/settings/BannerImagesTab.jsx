import React, { useState } from "react";
import { Plus, Image as ImageIcon, Edit2 } from "lucide-react";

import EditBannerModal from "./EditBannerModal";
import { Button } from "../common/Button";

const MAX_IMAGES = 12;

const BannerImagesTab = ({ heroImages = [], loading }) => {
  const [editingImage, setEditingImage] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const images = heroImages || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Banner Images
            </h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[var(--text-secondary)]">
          Loading banner images...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-default)] rounded-3xl">
          <ImageIcon
            size={48}
            className="mx-auto text-[var(--text-muted)] mb-4"
          />
          <p className="text-[var(--text-secondary)]">No banner images yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Add up to {MAX_IMAGES} images for the homepage carousel
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative bg-[var(--bg-base)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Edit Button */}

              <img
                src={img.url}
                alt="Banner"
                className="w-full aspect-video object-cover"
              />

              <div className="flex items-center justify-between p-4 text-sm text-[var(--text-secondary)]">
                <h2>Banner #{images.indexOf(img) + 1}</h2>

                <Button onClick={() => setEditingImage(img)} variant="warning">
                  <Edit2 size={18} />
                </Button>
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
