import React, { useState, lazy, Suspense, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import useFileFunction from "../../services/api/useFileFunction";
import {
  useCreateCardMutation,
  useGetDigitalCardQuery,
  useUpdateCardMutation,
} from "../../services/api/CustomerApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../redux/features/DigitalCards/DigitalCardsSlice";

// Preload critical forms, lazy load others
import CompanyForm from "./Forms/CompanyForm";
import AboutForm from "./Forms/AboutForm";
const SocialForm = lazy(() => import("./Forms/SocialForm"));
const ServicesForm = lazy(() => import("./Forms/ServicesForm"));
const BankDetailForm = lazy(() => import("./Forms/BankDetailForm"));
const GalleryForm = lazy(() => import("./Forms/GalleryForm"));
const ExtraDetailForm = lazy(() => import("./Forms/ExtraDetailForm"));

const steps = [
  { key: "companyInfo", title: "Company Info", component: CompanyForm },
  { key: "socialVideo", title: "Social Media", component: SocialForm },
  { key: "aboutInfo", title: "About Info", component: AboutForm },
  { key: "services", title: "Services", component: ServicesForm },
  { key: "bankDetails", title: "Bank Details", component: BankDetailForm },
  { key: "gallery", title: "Gallery", component: GalleryForm },
  { key: "extraDetails", title: "Extra Details", component: ExtraDetailForm },
];

const CreateCard = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [files, setFiles] = useState([]);
  const { uploadFile } = useFileFunction();
  const navigate = useNavigate();

  const routeParams = useParams();
  const cid = routeParams?.id;

  // step from query param
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStepFromURL = parseInt(searchParams.get("step") || "0", 10);
  const [activeStep, setActiveStep] = useState(initialStepFromURL);

  // Keep URL in sync when activeStep changes
  useEffect(() => {
    if (cid) {
      setSearchParams({ step: activeStep });
    }
  }, [activeStep, cid, setSearchParams]);

  const { data: cardDetail } = useGetDigitalCardQuery(cid, {
    refetchOnMountOrArgChange: false, // Only refetch when necessary
    skip: !cid,
    // Cache for 5 minutes to improve performance
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const digitalCard = useSelector(getDigitalCard);
  const [updateCard] = useUpdateCardMutation();
  const [createCard] = useCreateCardMutation();

  const handleSubmit = useCallback(async (values) => {
    const currentStepKey = steps[activeStep].key;
    const currentData = values;
    let updatedColumnData = currentData;

    switch (currentStepKey) {
      case "aboutInfo":
        updatedColumnData = {
          ...currentData,
          ...(files.length > 0 &&
            files[0] instanceof File && {
              documents: await uploadFile(files[0]),
            }),
        };
        break;

      case "companyInfo":
        updatedColumnData = {
          ...values,
          ...(files.length > 0 &&
            files[0] instanceof File && {
              logoImage: await uploadFile(files[0]),
            }),
        };
        break;
      case "services":
        updatedColumnData = await Promise.all(
          currentData?.map(async (service) => {
            const productImage =
              service.productImage instanceof File
                ? await uploadFile(service.productImage)
                : service.productImage;
            return { ...service, productImage };
          })
        );
        break;

      // case "services":
      //   updatedColumnData = await Promise.all(
      //     currentData?.map(async (service, index) => {
      //       const fileToUpload =
      //         service.productImage instanceof File
      //           ? service.productImage
      //           : files[index];

      //       if (
      //         typeof service.productImage === "string" &&
      //         !service.productImage.startsWith("data:")
      //       ) {
      //         return service;
      //       }

      //       if (fileToUpload instanceof File) {
      //         const uploadedImage = await uploadFile(fileToUpload);
      //         return { ...service, productImage: uploadedImage };
      //       }

      //       return service;
      //     })
      //   );
      //   break;

      case "gallery":
        updatedColumnData = {
          images: await Promise.all(
            (currentData?.images || []).map(async (img) =>
              img instanceof File ? await uploadFile(img) : img
            )
          ),
        };
        break;

      case "bankDetails":
        updatedColumnData = {
          ...currentData,
          bankName: values?.bankName || "",
          accountNo: values?.accountNo || "",
          branchName: values?.branchName || "",
          ifscCode: values?.ifscCode || "",
          acHolderName: values?.acHolderName || "",
          accountType: values?.accountType || "",
          ibanNumber: values?.ibanNumber || "",
          swiftCode: values?.swiftCode || "",
          onlineTransferDetails: {
            googlePay: values?.googlePay || "",
            paytm: values?.paytm || "",
            phonePe: values?.phonePe || "",
            upiId: values?.upiId || "",
            ...(currentData.googlePayQrCode instanceof File && {
              googlePayQRImage: await uploadFile(currentData?.googlePayQrCode),
            }),
            ...(currentData?.phonePeQrCode instanceof File && {
              phonePeQRImage: await uploadFile(currentData?.phonePeQrCode),
            }),
            ...(currentData?.upiQrCode instanceof File && {
              upiQRImage: await uploadFile(currentData?.upiQrCode),
            }),
          },
        };
        break;

      default:
        updatedColumnData = currentData;
    }

    try {
      let success = false;
      if (values?._id || digitalCard?.id) {
        const payload = {
          id: cardDetail.id,
          column: currentStepKey,
          data: updatedColumnData,
        };
        const data = await updateCard(payload);
        if (!data?.error) success = true;
      } else {
        const data = await createCard({
          companyInfo: updatedColumnData,
        });
        if (!data?.error) success = true;
        let slug = data?.data?.data?.slug
          ? data?.data?.data?.slug
          : cardDetail.slug;
        navigate(`/edit-card/${slug}?step=${activeStep + 1}`);
      }
      if (success) {
        console.log("Saved successfully");
      }
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        navigate(`/my-cards`);
      }
    } catch (error) {
      console.error("error", error);
    }
  }, [activeStep, uploadFile, updateCard, createCard, cardDetail, digitalCard, navigate, setActiveStep, files]);

  const formProps = useMemo(() => ({
    onSubmit: (values) => handleSubmit(values, true),
    setFiles,
    isMobile,
  }), [handleSubmit, setFiles, isMobile]);

  const renderStepContent = useCallback((stepIndex) => {
    const StepFormComponent = steps[stepIndex].component;

    return (
      <Suspense
        fallback={
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        <StepFormComponent {...formProps} />
      </Suspense>
    );
  }, [formProps]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Create Digital Card
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Fill in the details to create your professional digital business card
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        {isMobile ? (
          <>
            <Typography variant="subtitle2" color="textSecondary" mb={2}>
              Step {activeStep + 1} of {steps.length}
            </Typography>

            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <Paper
                  key={step.key}
                  variant="outlined"
                  onClick={() => {
                    if (cid) setActiveStep(index);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    borderColor: isActive ? "primary.main" : "grey.300",
                    backgroundColor: isActive ? "primary.50" : "white",
                    cursor: cid ? "pointer" : "default",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: isActive ? "primary.main" : "grey.300",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={600} fontSize={15}>
                      {step.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={isActive ? "primary.main" : "text.secondary"}
                    >
                      {isActive ? "Current step" : "Pending"}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}

            <Drawer
              anchor="right"
              open={activeStep !== null}
              onClose={() => setActiveStep(null)}
              PaperProps={{
                sx: { width: "100%", maxWidth: "100vw" },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    {steps[activeStep].title}
                  </Typography>
                  <IconButton onClick={() => setActiveStep(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box>{renderStepContent(activeStep)}</Box>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((step, index) => (
                <Step
                  key={step.key}
                  onClick={() => {
                    if (cid) setActiveStep(index);
                  }}
                  sx={{
                    cursor: cid ? "pointer" : "default",
                  }}
                >
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Button
              disabled={activeStep <= 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Back
            </Button>

            <Box>{renderStepContent(activeStep)}</Box>
          </>
        )}
      </Paper>
    </Box>
  );
});

export default CreateCard;
