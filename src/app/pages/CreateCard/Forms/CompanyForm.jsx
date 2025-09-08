import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, IconButton, InputLabel, CircularProgress } from "@mui/material";
import _ from "lodash";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../../redux/features/DigitalCards/DigitalCardsSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { parsePhoneNumber } from "libphonenumber-js";

// Helper function
const validatePhoneNumber = (value) => {
  if (!value) return false;
  try {
    const phoneNumber = parsePhoneNumber(value);
    return phoneNumber && phoneNumber.isValid() && phoneNumber.nationalNumber.length === 10;
  } catch (e) {
    return false;
  }
};

// FuseLoading component replacement
const FuseLoading = ({ className }) => (
  <Box className={className} display="flex" justifyContent="center" alignItems="center">
    <CircularProgress />
  </Box>
);

const defaultValues = {
  businessName: "",
  name: "",
  designation: "",
  country: "",
  contactNumber1: "",
  whatsappNumber1: "",
  contactNumber2: "",
  whatsappNumber2: "",
  landlineNumber: "",
  email: "",
  websiteUrl: "",
  googleMapLink: "",
  address: "",
  logoImage: "",
};

const schema = yup.object().shape({
  businessName: yup.string().required("Business Name is required"),
  name: yup.string().required("Contact Name is required"),
  designation: yup.string().required("Designation is required"),
  country: yup.string().required("Country Name is required"),

  contactNumber1: yup
    .string()
    .required("Contact Number 1 is required")
    .test(
      "valid-phone",
      "Contact Number 1 must be a valid phone number with exactly 10 digits after country code",
      validatePhoneNumber
    ),

  whatsappNumber1: yup
    .string()
    .required("WhatsApp Number 1 is required")
    .test(
      "valid-phone",
      "WhatsApp Number 1 must be a valid phone number with exactly 10 digits after country code",
      validatePhoneNumber
    ),

  contactNumber2: yup
    .string()
    .notRequired()
    .test(
      "valid-phone",
      "Contact Number 2 must be a valid phone number with exactly 10 digits after country code",
      (value) => (value ? validatePhoneNumber(value) : true)
    ),

  whatsappNumber2: yup
    .string()
    .notRequired()
    .test(
      "valid-phone",
      "WhatsApp Number 2 must be a valid phone number with exactly 10 digits after country code",
      (value) => (value ? validatePhoneNumber(value) : true)
    ),

  landlineNumber: yup
    .string()
    .notRequired()
    ,

  email: yup.string().email().required("Email is required"),
  address: yup.string().required("Address is required"),
  websiteUrl: yup.string().notRequired(),

  googleMapLink: yup
    .string()
    .required("Google Map Link is required")
    .test(
      "is-google-maps-url",
      "Please enter a valid Google Maps link",
      function (value) {
        if (!value) return false;
        const patterns = [
          /^https:\/\/maps\.google\.com/,
          /^https:\/\/www\.google\.com\/maps/,
          /^https:\/\/goo\.gl\/maps/,
          /^https:\/\/maps\.app\.goo\.gl/,
          /^https:\/\/www\.google\.co\..*\/maps/,
          /^https:\/\/maps\.google\./,
        ];
        return patterns.some((pattern) => pattern.test(value));
      }
    ),

  logoImage: yup
    .string()
    .required("Logo Image is required")
    .test(
      "is-logo-uploaded",
      "Please upload a logo image",
      (value) => value && value.trim() !== "" && !value.includes("null")
    ),
});




function CompanyForm({ onSubmit, setFiles }) {
  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const routeParams = useParams();

  const digitalCard = useSelector(getDigitalCard);

  useEffect(() => {
    if (digitalCard?.companyInfo && routeParams?.id) {
      reset(digitalCard?.companyInfo);
    }
  }, [digitalCard?.companyInfo, reset]);

  const { isValid, errors } = formState;

  const form = watch();

  if (!digitalCard?.companyInfo && routeParams?.id) {
    return <FuseLoading className="min-h-screen" />;
  }

  return (
    <>
      <Box className="flex items-center pt-4 mt-4 border-t">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Company Information
        </Typography>
      </Box>
      <div className="relative flex flex-col flex-auto">
        <div className="flex justify-center lg:flex-nowrap flex-wrap lg:gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
            <Controller
              control={control}
              name="businessName"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Business Name"
                  placeholder="Enter your business name"
                  id="name"
                  error={!!errors.businessName}
                  helperText={errors?.businessName?.message}
                  variant="outlined"
                  //required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Contact Name"
                  placeholder="Enter your contact name"
                  id="name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                 // required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
            <Controller
              control={control}
              name="designation"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Designation"
                  placeholder="Enter your designation"
                  id="name"
                  error={!!errors.designation}
                  helperText={errors?.designation?.message}
                  variant="outlined"
                 // required
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-10">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Email"
                  placeholder="Enter your email"
                  id="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  //required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-10">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Country Name"
                  placeholder="Enter your country name"
                  id="country"
                  error={!!errors.country}
                  helperText={errors?.country?.message}
                  variant="outlined"
                  //required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-10">
            <Controller
              control={control}
              name="landlineNumber"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Landline Number"
                  placeholder="Enter your landline number"
                  id="landlineNumber"
                  error={!!errors.landlineNumber}
                  helperText={errors?.landlineNumber?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/2 mt-8 lg:mt-10">
            <Controller
              control={control}
              name="websiteUrl"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Website URL"
                  placeholder="Enter your website URL"
                  id="websiteUrl"
                  error={!!errors.websiteUrl}
                  helperText={errors?.websiteUrl?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/2 lg:mt-10">
            <Controller
              control={control}
              name="googleMapLink"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Google Map Link"
                  placeholder="https://maps.google.com/... or https://goo.gl/maps/..."
                  id="googleMapLink"
                  error={!!errors.googleMapLink}
                  helperText={
                    errors?.googleMapLink?.message ||
                    "Enter a valid Google Maps URL"
                  }
                  variant="outlined"
                 // required
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8 mt-8 lg:mt-10">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-2">
            <InputLabel className="font-bold mb-2">
              Contact Number 1<span className="text-red"></span>
            </InputLabel>

            <Controller
              name="contactNumber1"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="IN"
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  value={field.value}
                  international
                  
                  className={errors.contactNumber1 ? "PhoneInput--error" : ""}
                />
              )}
            />

            {errors.contactNumber1 && (
              <Typography color="error" variant="caption">
                {errors.contactNumber1.message}
              </Typography>
            )}
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-2">
            <InputLabel className="font-bold mb-2">
              WhatsApp Number 1<span className="text-red"></span>
            </InputLabel>

            <Controller
              name="whatsappNumber1"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="IN"
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  value={field.value}
                  international
                  className={errors.whatsappNumber1 ? "PhoneInput--error" : ""}
                />
              )}
            />

            {errors.whatsappNumber1 && (
              <Typography color="error" variant="caption">
                {errors.whatsappNumber1.message}
              </Typography>
            )}
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-2">
            <InputLabel className="font-bold mb-2">Contact Number 2</InputLabel>

            <Controller
              name="contactNumber2"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="IN"
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  value={field.value}
                  international
                  className={errors.contactNumber2 ? "PhoneInput--error" : ""}
                />
              )}
            />

            {errors.contactNumber2 && (
              <Typography color="error" variant="caption">
                {errors.contactNumber2.message}
              </Typography>
            )}
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-2">
            <InputLabel className="font-bold mb-2">
              WhatsApp Number 2
            </InputLabel>

            <Controller
              name="whatsappNumber2"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="IN"
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  value={field.value}
                  international
                  className={errors.whatsappNumber2 ? "PhoneInput--error" : ""}
                />
              )}
            />

            {errors.whatsappNumber2 && (
              <Typography color="error" variant="caption">
                {errors.whatsappNumber2.message}
              </Typography>
            )}
          </div>
        </div>

        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8 mt-10">
          <div className="h-full w-full flex flex-col">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="custom-textfield custom-field"
                  size="small"
                  label="Address"
                  placeholder="Enter your address"
                  id="address"
                  error={!!errors.address}
                  helperText={errors?.address?.message}
                  variant="outlined"
                  //required
                  fullWidth
                  multiline
                  minRows={5}
                />
              )}
            />
          </div>
        </div>

        <div className="h-full w-full lg:w-1/2 mt-8">
          <Typography fontSize={16} mr={8} mb={1} className="text-primary">
            Logo Image <span className="text-red-500"></span>
          </Typography>
          <div className="h-full w-full flex justify-center lg:justify-start">
            <Controller
              name="logoImage"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Box
                    component="label"
                    htmlFor="logoImage"
                    className="cursor-pointer productImageUpload flex items-center sm:justify-center relative w-56 h-56 rounded-12 mb-16 overflow-hidden shadow hover:shadow-lg"
                  >
                    <input
                      accept="image/*"
                      className="hidden"
                      id="logoImage"
                      type="file"
                      onChange={(e) => {
                        const file = e?.target?.files?.[0];
                        if (!file) {
                          onChange("");
                          setFiles([]);
                          return;
                        }

                        setFiles([file]);

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (typeof event.target.result === "string") {
                            onChange(event.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
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
                          setFiles([]);
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
          {errors?.logoImage && (
            <Typography
              color="error"
              variant="caption"
              className="mt-2 text-center block"
            >
              {errors.logoImage.message}
            </Typography>
          )}
        </div>
      </div>

      <Box className="flex justify-end ">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Save & Next
        </Button>
      </Box>
    </>
  );
}

export default CompanyForm;