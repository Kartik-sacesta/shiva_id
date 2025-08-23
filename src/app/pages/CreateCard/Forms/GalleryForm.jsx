import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const defaultValues = {};
const schema = yup.object().shape({});

function GalleryForm({ onSubmit }) {
  const [galleryFiles, setGalleryFiles] = useState([]); // store full File objects
  const { handleSubmit } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files].slice(0, 20)); // keep only files
  };

  const handleRemoveImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // // Convert File to base64 for preview
  // const getPreview = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.readAsDataURL(file);
  //   });
  // };

  const handleFormSubmit = async () => {
    const payload = {
      images: galleryFiles, // full File objects
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Box sx={{ padding: 3 }}>
        <Typography className="text-24 font-bold">GALLERY</Typography>

        <Box className="mt-4">
          <Typography fontSize={16} mb={1} className="text-primary">
            Choose Gallery images (Upload up to 20 images)
          </Typography>

          <Box className="mb-4">
            <input
              accept="image/*"
              id="gallery-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleGalleryChange}
            />
            <label htmlFor="gallery-upload">
              <Box
                component="span"
                className="inline-flex items-center justify-center border rounded-md px-4 py-2 cursor-pointer text-primary"
                sx={{ gap: 1 }}
              >
                <AddPhotoAlternateIcon />
                Upload Images
              </Box>
            </label>
          </Box>

          {/* Image Preview */}
          <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {galleryFiles.map((file, index) => (
              <Box
                key={index}
                className="relative rounded overflow-hidden shadow border"
                sx={{ width: 120, height: 120 }}
              >
                {/* We generate preview on the fly */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.8)",
                    },
                  }}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="flex justify-end">
          <Button variant="contained" color="primary" type="submit">
            Save & Next
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default GalleryForm;
