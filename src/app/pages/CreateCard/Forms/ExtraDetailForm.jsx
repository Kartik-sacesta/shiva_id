import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import _ from "@lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import _ from "lodash";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../../redux/features/DigitalCards/DigitalCardsSlice";

const defaultValues = {
  note: "",
  paidAmount: 0,
  pendingAmount: 0,
};

const schema = yup.object().shape({
  note: yup.string().notRequired(),
  paidAmount: yup.number().notRequired(),
  pendingAmount: yup.number().notRequired(),
});

function ExtraDetailForm({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, formState } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid } = formState;
  const digitalCard = useSelector(getDigitalCard);

  useEffect(() => {
    reset({
      ...digitalCard?.extraDetails,
      _id: digitalCard?.id, // add the extra field
    });
  }, [digitalCard?.extraDetails, digitalCard?.id, reset]);

  const handleFormSubmit = (values) => {
    setLoading(true);
    onSubmit(values);
    console.log(values);
  };

  return (
    <>
      <Box className="flex items-center pt-4 mt-4 border-t">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Extra Details
        </Typography>
      </Box>
      <div className="relative flex flex-col flex-auto">
        <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8">
          <div className="h-full w-full flex flex-col lg:w-1/3 mt-8">
            <Controller
              control={control}
              name="note"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  label="Note Name"
                  placeholder="Enter your Note Name"
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
              name="paidAmount"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  type="number"
                  label="Paid Amount"
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
              name="pendingAmount"
              render={({ field }) => (
                <TextField
                  className="custom-textfield custom-field"
                  {...field}
                  size="small"
                  type="number"
                  label="Pending Amount"
                  id="name"
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
          onClick={handleSubmit(handleFormSubmit)}
          disabled={loading || !isValid}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

export default ExtraDetailForm;
