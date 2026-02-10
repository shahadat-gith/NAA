import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import "./Styles/ImageUploadModal.css";
import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords } from "../../utils/utility";
import toast from "react-hot-toast"

const ImageUploadModal = ({ open, student, onClose, setStudents }) => {
	const { backendUrl, adminToken } = useContext(AdminContext);

	const fileInputRef = useRef(null);

	const [rawImageUrl, setRawImageUrl] = useState("");
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [croppedBlob, setCroppedBlob] = useState(null);
	const [croppedPreview, setCroppedPreview] = useState("");
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (!open) resetState();
	}, [open]);

	const resetState = () => {
		setRawImageUrl("");
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		setCroppedBlob(null);
		setCroppedPreview("");
	};

	const onCropComplete = useCallback((_, croppedPixels) => {
		setCroppedAreaPixels(croppedPixels);
	}, []);

	const handleImageSelection = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setRawImageUrl(URL.createObjectURL(file));
		setCroppedBlob(null);
		setCroppedPreview("");
	};

	const applyCrop = async () => {
		if (!croppedAreaPixels || !rawImageUrl) return;

		const image = new Image();
		image.src = rawImageUrl;
		await new Promise((resolve) => (image.onload = resolve));

		const canvas = document.createElement("canvas");
		canvas.width = croppedAreaPixels.width;
		canvas.height = croppedAreaPixels.height;

		const ctx = canvas.getContext("2d");
		ctx.drawImage(
			image,
			croppedAreaPixels.x,
			croppedAreaPixels.y,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
			0,
			0,
			croppedAreaPixels.width,
			croppedAreaPixels.height
		);

		canvas.toBlob((blob) => {
			if (!blob) return;
			setCroppedBlob(blob);
			setCroppedPreview(URL.createObjectURL(blob));
		}, "image/jpeg", 0.9);
	};

	const handleUpload = async () => {
		if (!croppedBlob || !student) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("image", croppedBlob, "student.jpg");

		// Add existing public_id to body if it exists
		if (student.image?.public_id) {
			formData.append("oldPublicId", student.image.public_id);
		}

		try {
			const { data } = await axios.post(
				`${backendUrl}/api/student/upload-profile-picture?id=${student._id}`,
				formData,
				{ headers: { Authorization: `Bearer ${adminToken}` } }
			);

			if (data.success) {
				// Assuming the backend returns the updated student list or you have access to setStudents via context/props
				if (setStudents && data.students) {
					setStudents(data.students);
				}
				toast.success(data.message);
				onClose();
			} else {
				toast.error(data.message || "Upload failed");
			}
		} catch (error) {
			console.error("Upload Error:", error);
			toast.error(
				error.response?.data?.message || "An error occurred during upload"
			);
		} finally {
			setUploading(false);
		}
	};

	if (!open) return null;

	return (
		<div className="student-image-modal-overlay" onClick={onClose}>
			<div className="student-image-modal" onClick={(e) => e.stopPropagation()}>
				{/* HEADER */}
				<div className="student-image-modal-header">
					<div>
						<h3>Upload Student Image</h3>
						<p>
							{capitalizeWords(student?.name)} | Class{" "}
							{capitalizeWords(student?.class)}
						</p>
					</div>
					<button onClick={onClose}>×</button>
				</div>

				{/* BODY */}
				<div className="student-image-modal-body">
					<div className="crop-layout">
						{/* LEFT IMAGE EDITOR */}
						<div className="crop-image-area">
							{rawImageUrl ? (
								<Cropper
									image={rawImageUrl}
									crop={crop}
									zoom={zoom}
									aspect={1}
									onCropChange={setCrop}
									onZoomChange={setZoom}
									onCropComplete={onCropComplete}
								/>
							) : (
								<div className="empty-preview">
									<p>No image selected</p>
									<button
										className="select-image-btn"
										onClick={() => fileInputRef.current.click()}
									>
										Select Image
									</button>
								</div>
							)}
						</div>

						{/* RIGHT PREVIEW & CONTROLS */}
						<div className="crop-options">
							<label>
								Zoom
								<input
									type="range"
									min="1"
									max="3"
									step="0.1"
									value={zoom}
									onChange={(e) => setZoom(+e.target.value)}
									disabled={!rawImageUrl}
								/>
							</label>

							<div className="preview-container">
								{croppedPreview ? (
									<img src={croppedPreview} alt="Cropped Preview" className="side-preview-img" />
								) : (
									<div className="preview-placeholder">Cropped image will appear here</div>
								)}
							</div>

							<button
								className="crop-btn"
								onClick={applyCrop}
								disabled={!rawImageUrl}
							>
								Crop IMAGE →
							</button>
						</div>
					</div>
				</div>

				{/* FOOTER */}
				<div className="student-image-modal-actions">
					<button className="secondary-btn" onClick={resetState}>
						Reset
					</button>
					<button
						className="primary-btn"
						onClick={handleUpload}
						disabled={!croppedBlob || uploading}
					>
						{uploading ? "Uploading..." : "Upload Image"}
					</button>
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleImageSelection}
				/>
			</div>
		</div>
	);
};

export default ImageUploadModal;