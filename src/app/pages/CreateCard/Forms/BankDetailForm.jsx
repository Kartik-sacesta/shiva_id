import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import _ from "@lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import _ from "lodash";
import "react-phone-number-input/style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../../redux/features/DigitalCards/DigitalCardsSlice";

const defaultValues = {
  bankName: "",
  accountNo: "",
  branchName: "",
  ifscCode: "",
  acHolderName: "",
  accountType: "",
  ibanNumber: "",
  swiftCode: "",
  googlePay: "",
  paytm: "",
  phonePe: "",
  upiId: "",
  googlePayQrCode: "",
  upiQrCode: "",
  phonePeQrCode: "",
};

const schema = yup.object().shape({
  bankName: yup.string().notRequired(),
  accountNo: yup.string().notRequired(),
  branchName: yup.string().notRequired(),
  ifscCode: yup.string().notRequired(),
  acHolderName: yup.string().notRequired(),
  accountType: yup.string().notRequired(),
  ibanNumber: yup.string().notRequired(),
  swiftCode: yup.string().notRequired(),
  googlePay: yup.string().notRequired(),
  paytm: yup.string().notRequired(),
  phonePe: yup.string().notRequired(),
  upiId: yup.string().notRequired(),
  googlePayQrCode: yup.string().notRequired(),
  upiQrCode: yup.string().notRequired(),
  phonePeQrCode: yup.string().notRequired(),
});

function BankDetailForm({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const { control, reset, handleSubmit, formState } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [googlePayQrCode, setGooglePayQrCode] = useState();
  const [upiQrCode, setUpiQrCode] = useState();
  const [phonePeQrCode, setPhonePeQrCode] = useState();

  const digitalCard = useSelector(getDigitalCard);

  const { errors } = formState;

  useEffect(() => {
    reset({
      ...digitalCard?.bankDetails,
      ...digitalCard?.bankDetails?.onlineTransferDetails,
      _id: digitalCard?.id, // add the extra field
    });
  }, [digitalCard?.bankDetails, digitalCard?.id, reset]);

  const handleFormSubmit = (values) => {
    setLoading(true);
    values.googlePayQrCode = googlePayQrCode;
    values.upiQrCode = upiQrCode;
    values.phonePeQrCode = phonePeQrCode;
    onSubmit(values);
  };

  return (
    <>
      <Box className="items-center pt-4 mt-4 border-t">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Account Details
        </Typography>
        <div className="relative flex flex-col flex-auto">
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
            <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
              <Controller
                control={control}
                name="bankName"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Bank Name"
                    placeholder="Enter your Bank Name"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
              <Controller
                control={control}
                name="accountNo"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Account Number"
                    type="number"
                    placeholder="Enter your Account Number"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
              <Controller
                control={control}
                name="branchName"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Branch Name"
                    placeholder="Enter your Branch Name"
                    id="name"
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
                name="ifscCode"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="IFSC Code"
                    placeholder="Enter your IFSC Code"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
              <Controller
                control={control}
                name="acHolderName"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Account Holder Name"
                    placeholder="Enter your Account Holder Name"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
              <Controller
                control={control}
                name="accountType"
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.currency}>
                    <InputLabel id="currency-label">Account Type</InputLabel>
                    <Select
                      {...field}
                      labelId="currency-label"
                      label="Account Type"
                      MenuProps={{ style: { maxHeight: 300 } }}
                    >
                      <MenuItem value="">Choose</MenuItem>
                      <MenuItem key={0} value="Savings">
                        Savings
                      </MenuItem>{" "}
                      <MenuItem key={1} value="Current">
                        Current
                      </MenuItem>{" "}
                    </Select>
                    <FormHelperText>
                      {errors?.accountType?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
            <div className="h-full w-full flex flex-col lg:w-1/2 mt-8">
              <Controller
                control={control}
                name="ibanNumber"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="IBAN Number"
                    placeholder="Enter your IBAN Number"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/2 lg:mt-8">
              <Controller
                control={control}
                name="swiftCode"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Swift Code"
                    placeholder="Enter your Swift Code"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
        </div>
      </Box>
      <Box className="items-center mt-8">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Account Details (International Usage)
        </Typography>
        <div className="relative flex flex-col flex-auto">
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
            <div className="h-full w-full flex flex-col lg:w-1/2 mt-4">
              <Controller
                control={control}
                name="ibanNumber"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="IBAN Number"
                    placeholder="Enter your IBAN Number"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/2 lg:mt-4">
              <Controller
                control={control}
                name="swiftCode"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Swift Code"
                    placeholder="Enter your Swift Code"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
        </div>
      </Box>
      <Box className="items-center mt-8">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Online Transfer
        </Typography>
        <div className="relative flex flex-col flex-auto">
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
            <div className="h-full w-full flex flex-col lg:w-1/4 mt-4">
              <Controller
                control={control}
                name="googlePay"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Google Pay"
                    placeholder="Enter your Google Pay Id"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/4 lg:mt-4">
              <Controller
                control={control}
                name="paytm"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="Paytm"
                    placeholder="Enter your Paytm Id"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/4 lg:mt-4">
              <Controller
                control={control}
                name="phonePe"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="PhonePe"
                    placeholder="Enter your PhonePe Id"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/4 lg:mt-4">
              <Controller
                control={control}
                name="upiId"
                render={({ field }) => (
                  <TextField
                    className="custom-textfield custom-field"
                    {...field}
                    size="small"
                    label="UPI Id"
                    placeholder="Enter your UPI Id"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-col flex-auto">
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
            <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
              <Typography fontSize={16} mr={8} mb={1} className="text-primary">
                Google Pay QR Code
              </Typography>
              <div className="h-full w-full flex justify-center">
                <Controller
                  name="googlePayQrCode"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Box
                        component="label"
                        htmlFor="googlePayQrCode"
                        className="cursor-pointer productImageUpload flex items-center justify-center relative w-56 h-56 rounded-12 lg:mb-16 overflow-hidden shadow hover:shadow-lg"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="googlePayQrCode"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setGooglePayQrCode(file);
                            if (file) {
                              onChange(file); // store the File object
                            }
                          }}
                        />
                        <img
                          className="max-w-none w-auto h-full"
                          src={
                            value instanceof File
                              ? URL.createObjectURL(value)
                              : "/images/upload.jpg"
                          }
                          alt="Upload Preview"
                        />
                      </Box>
                      {value instanceof File && (
                        <div className="h-full">
                          <IconButton
                            className="bg-nav transition-none ml-8"
                            onClick={() => onChange(null)}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
              <Typography fontSize={16} mr={8} mb={1} className="text-primary">
                PhonePe QR Code
              </Typography>
              <div className="h-full w-full flex justify-center">
                <Controller
                  name="phonePeQrCode"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Box
                        component="label"
                        htmlFor="phonePeQrCode"
                        className="cursor-pointer productImageUpload flex items-center justify-center relative w-56 h-56 rounded-12 lg:mb-16 overflow-hidden shadow hover:shadow-lg"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="phonePeQrCode"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e?.target?.files?.[0];
                                setPhonePeQrCode(file);
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
            <div className="h-full w-full flex flex-col lg:w-1/3 lg:mt-8">
              <Typography fontSize={16} mr={8} mb={1} className="text-primary">
                UPI QR Code
              </Typography>
              <div className="h-full w-full flex justify-center">
                <Controller
                  name="upiQrCode"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Box
                        component="label"
                        htmlFor="upiQrCode"
                        className="cursor-pointer productImageUpload flex items-center justify-center relative w-56 h-56 rounded-12 mb-16 overflow-hidden shadow hover:shadow-lg"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="upiQrCode"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e?.target?.files?.[0];
                                setUpiQrCode(file);
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
        </div>
        <Box className="flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleFormSubmit)}
            // disabled={loading || !isValid}
          >
            Save & Next
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default BankDetailForm;
