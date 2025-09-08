import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import _ from "@lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconButton,
  Button,
} from "@mui/material";
import _ from "lodash";
import "react-phone-number-input/style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getYears } from "../../../constants/GetYearsConstants";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../../redux/features/DigitalCards/DigitalCardsSlice";

const defaultValues = {
  establishmentYear: "",
  natureOfBusiness: "",
  otherBusiness: "",
  gstinNo: "",
  aboutCompany: "",
  documents: "",
};

const schema = yup.object().shape({
  establishmentYear: yup.mixed().required("Establishment is required"),
  natureOfBusiness: yup.string().required("Nature of Business is required"),
  otherBusiness: yup.string().notRequired(),
  gstinNo: yup.string().notRequired(),
  aboutCompany: yup.string().required("About company is required"),
  documents: yup.string().notRequired(),
});

function AboutForm({ onSubmit, setFiles }) {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState, reset } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const digitalCard = useSelector(getDigitalCard);

  useEffect(() => {
    reset({
      ...digitalCard?.aboutInfo,
      _id: digitalCard?.id, // add the extra field
    });
  }, [digitalCard?.aboutInfo, digitalCard?.id, reset]);

  const { errors, isValid } = formState;

  const handleFormSubmit = (values) => {
    setLoading(true);
    onSubmit(values);
    setLoading(false);
  };


  return (
    <>
      <Box className="flex items-center pt-4 mt-4 border-t">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          About Information
        </Typography>
      </Box>
      <div className="relative flex flex-col flex-auto">
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-2">
            <Controller
              name="establishmentYear"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Establishment Year <span className="text-red-500"></span>
                  </label>
                  <select
                    {...field}
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.establishmentYear
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select Year
                    </option>
                    {getYears().map((items) => (
                      <option key={items.id} value={items.value}>
                        {items.name}
                      </option>
                    ))}
                  </select>
                  {errors?.establishmentYear && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.establishmentYear.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="natureOfBusiness"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Nature of Business"
                  placeholder="Enter your nature of business"
                  id="name"
                  error={!!errors.natureOfBusiness}
                  helperText={errors?.natureOfBusiness?.message}
                  variant="outlined"
                 // required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="otherBusiness"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Other Business  (if applicable)"
                  placeholder="Enter your other business"
                  id="name"
                  error={!!errors.otherBusiness}
                  helperText={errors?.otherBusiness?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="gstinNo"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="GSTIN Number"
                  placeholder="Enter your GST Number"
                  id="name"
                  error={!!errors.gstinNo}
                  helperText={errors?.gstinNo?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8 mt-8">
          <div className="h-full w-full flex flex-col">
            <Controller
              control={control}
              name="aboutCompany"
              render={({ field }) => (
                <>
                  <label
                    htmlFor="aboutCompany"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    About the Company <span className="text-red-500"></span>
                  </label>
                  <textarea
                    {...field}
                    id="aboutCompany"
                    placeholder="Describe your company"
                    rows={5}
                    className={`border rounded-md p-2 text-sm ${
                      errors.aboutCompany ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </>
              )}
            />
          </div>
        </div>

        <div className="h-full w-full lg:w-1/2 mt-8">
          <Typography fontSize={16} mr={8} mb={1} className="text-primary">
            Upload Your Documents
          </Typography>
          <div className="h-full w-full flex justify-center">
            <Controller
              name="documents"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Box
                    component="label"
                    htmlFor="documents"
                    className="cursor-pointer productImageUpload flex items-center justify-center relative w-56 h-56 rounded-12 mb-16 overflow-hidden shadow hover:shadow-lg"
                  >
                    <input
                      accept="image/*"
                      className="hidden"
                      id="documents"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e?.target?.files?.[0];
                            setFiles([file]);
                            if (
                              !(e?.target?.files instanceof FileList) ||
                              !file
                            )
                              return;

                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                onChange(reader.result); // Set the base64 image directly
                                resolve(reader.result);
                              } else {
                                reject(
                                  new Error(
                                    "File reading did not result in a string."
                                  )
                                );
                              }
                            };

                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                          });
                        }

                        await readFileAsync();
                      }}
                    />
                    <img
                      className="max-w-none w-auto h-full"
                      src={
                        value && !value.includes("null")
                          ? value
                          : "/images/upload.jpg"
                      }
                      alt={"Image was not found."}
                    />
                  </Box>
                  {value && !value.includes("null") ? (
                    <div className="h-full">
                      <IconButton
                        className="bg-nav transition-none ml-8"
                        onClick={() => {
                          onChange("");
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Desktop Save & Next Button */}
      <Box className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={loading || !isValid}
        >
          Save & Next
        </Button>
      </Box>
    </>
  );
}

export default AboutForm;
