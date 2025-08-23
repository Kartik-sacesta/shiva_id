import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import _ from "@lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import "react-phone-number-input/style.css";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../../redux/features/DigitalCards/DigitalCardsSlice";

const defaultValues = {
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  linkdin: "",
  pinterest: "",
  otherLink1: "",
  otherLink2: "",
};

const schema = yup.object().shape({
  facebook: yup
    .string()
    .test(
      "is-facebook-url",
      "Please enter a valid Facebook URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        const facebookPatterns = [
          /^https:\/\/www\.facebook\.com\//,
          /^https:\/\/facebook\.com\//,
          /^https:\/\/m\.facebook\.com\//,
          /^https:\/\/fb\.me\//,
        ];
        return facebookPatterns.some((pattern) => pattern.test(value));
      }
    ),
  instagram: yup
    .string()
    .test(
      "is-instagram-url",
      "Please enter a valid Instagram URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        const instagramPatterns = [
          /^https:\/\/www\.instagram\.com\//,
          /^https:\/\/instagram\.com\//,
          /^https:\/\/instagr\.am\//,
        ];
        return instagramPatterns.some((pattern) => pattern.test(value));
      }
    ),
  youtube: yup
    .string()
    .test(
      "is-youtube-url",
      "Please enter a valid YouTube URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        const youtubePatterns = [
          /^https:\/\/www\.youtube\.com\//,
          /^https:\/\/youtube\.com\//,
          /^https:\/\/youtu\.be\//,
          /^https:\/\/m\.youtube\.com\//,
        ];
        return youtubePatterns.some((pattern) => pattern.test(value));
      }
    ),
  twitter: yup
    .string()
    .test(
      "is-twitter-url",
      "Please enter a valid Twitter/X URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        const twitterPatterns = [
          /^https:\/\/twitter\.com\//,
          /^https:\/\/www\.twitter\.com\//,
          /^https:\/\/x\.com\//,
          /^https:\/\/www\.x\.com\//,
        ];
        return twitterPatterns.some((pattern) => pattern.test(value));
      }
    ),
  linkdin: yup
    .string()
    .test(
      "is-linkedin-url",
      "Please enter a valid LinkedIn URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        const linkedinPatterns = [
          /^https:\/\/www\.linkedin\.com\//,
          /^https:\/\/linkedin\.com\//,
          /^https:\/\/in\.linkedin\.com\//,
        ];
        return linkedinPatterns.some((pattern) => pattern.test(value));
      }
    ),
  pinterest: yup
    .string()
    .test(
      "is-pinterest-url",
      "Please enter a valid Pinterest URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        const pinterestPatterns = [
          /^https:\/\/www\.pinterest\.com\//,
          /^https:\/\/pinterest\.com\//,
          /^https:\/\/pin\.it\//,
        ];
        return pinterestPatterns.some((pattern) => pattern.test(value));
      }
    ),
  otherLink1: yup
    .string()
    .test(
      "is-valid-url",
      "Please enter a valid URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        try {
          new URL(value);
          return value.startsWith("http://") || value.startsWith("https://");
        } catch {
          return false;
        }
      }
    ),
  otherLink2: yup
    .string()
    .test(
      "is-valid-url",
      "Please enter a valid URL",
      function (value) {
        if (!value || value.trim() === "") return true; // Optional field
        try {
          new URL(value);
          return value.startsWith("http://") || value.startsWith("https://");
        } catch {
          return false;
        }
      }
    ),
});

function SocialForm({ onSubmit }) {
  const { control, handleSubmit, formState, reset } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const digitalCard = useSelector(getDigitalCard);
  useEffect(() => {
    if (digitalCard?.socialVideo) {
      reset(digitalCard.socialVideo);
    }
  }, [digitalCard?.socialVideo, reset]);

  const { isValid, errors } = formState;

  return (
    <>
      <Box className="flex items-center pt-4 mt-4 border-t">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Social Information
        </Typography>
      </Box>
      <div className="relative flex flex-col flex-auto">
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-4 lg:mt-8">
            <Controller
              control={control}
              name="facebook"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Facebook"
                  placeholder="https://www.facebook.com/yourpage"
                  error={!!errors.facebook}
                  helperText={errors?.facebook?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="instagram"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Instagram"
                  placeholder="https://www.instagram.com/yourusername"
                  error={!!errors.instagram}
                  helperText={errors?.instagram?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="youtube"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="YouTube"
                  placeholder="https://www.youtube.com/channel/yourchannel"
                  error={!!errors.youtube}
                  helperText={errors?.youtube?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
            <Controller
              control={control}
              name="twitter"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Twitter/X"
                  placeholder="https://twitter.com/yourusername or https://x.com/yourusername"
                  error={!!errors.twitter}
                  helperText={errors?.twitter?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="linkdin"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="LinkedIn"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  error={!!errors.linkdin}
                  helperText={errors?.linkdin?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
            <Controller
              control={control}
              name="pinterest"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Pinterest"
                  placeholder="https://www.pinterest.com/yourprofile"
                  error={!!errors.pinterest}
                  helperText={errors?.pinterest?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/2 mt-8">
            <Controller
              control={control}
              name="otherLink1"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Other Link 1"
                  placeholder="https://www.example.com"
                  error={!!errors.otherLink1}
                  helperText={errors?.otherLink1?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-full w-full flex flex-col lg:w-1/2 lg:mt-8">
            <Controller
              control={control}
              name="otherLink2"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Other Link 2"
                  placeholder="https://www.example.com"
                  error={!!errors.otherLink2}
                  helperText={errors?.otherLink2?.message}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </div>
      </div>
      <Box className="flex justify-end mt-4">
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

export default SocialForm;
