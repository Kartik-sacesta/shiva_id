import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  RadioGroup,
  Radio,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import currencyCodes from "currency-codes";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { getDigitalCard } from "../../../redux/features/DigitalCards/DigitalCardsSlice";

const defaultValues = {
  type: "",
  productName: "",
  currency: "",
  price: "",
  isBestSelling: false,
  description: "",
  productImage: null,
};

const schema = yup.object().shape({
  type: yup.string().required("Type is required"),
  productName: yup.string().required("Name is required"),
  currency: yup.string().required("Currency is required"),
  price: yup.string().required("Price is required"),
  isBestSelling: yup.boolean().notRequired(),
  description: yup.string().required("Description is required"),
  productImage: yup.mixed().nullable().required("Product Image is required"), 
});


function ServicesForm({ onSubmit, isMobile }) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const { control, reset, handleSubmit, formState } = useForm({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const digitalCard = useSelector(getDigitalCard);
  useEffect(() => {
    if (digitalCard?.services) {
      // Ensure each service has a unique id for DataGrid
      const servicesWithIds = digitalCard.services.map((service, index) => ({
        ...service,
        id: service.id || `service-${Date.now()}-${index}`,
      }));
      setServices(servicesWithIds);
    }
  }, [digitalCard?.services]);

  const { isValid, errors } = formState;

  const columns = [
    {
      field: "type",
      headerName: "Type",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => <Typography>{params.row.type}</Typography>,
    },
    {
      field: "productImage",
      headerName: "Image",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        if (params.value instanceof File) {
          return (
            <img
              src={URL.createObjectURL(params.value)}
              alt=""
              width={50}
              height={50}
            />
          );
        } else if (typeof params.value === "string" && params.value) {
          return <img src={params.value} alt="" width={50} height={50} />;
        } else {
          return "No Image";
        }
      },
    },
    {
      field: "productName",
      headerName: "Name",
      width: 350,
      align: "center",
      sortable: false,
      headerAlign: "center",
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 200,
      align: "center",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            color="error"
            onClick={() => handleRemove(params.row.id)}
          >
            Remove
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (service) => {
    setShowForm(true);
    setEditId(service.id);

    reset({
      type: service.type || "",
      productName: service.productName || "",
      currency: service.currency || "",
      price: service.price || "",
      isBestSelling: service.isBestSelling || false,
      description: service.description || "",
      productImage: service.productImage || null,
    });
  };

  const onProductSubmit = (data) => {
    setLoading(true);

    if (editId) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...data, id: editId } : item
        )
      );
      setEditId(null);
    } else {
      const newId = Date.now();
      setServices((prev) => [...prev, { ...data, id: newId }]);
    }

    setLoading(false);
    reset(defaultValues);
    setShowForm(false);
  };

  const handleFormSubmit = () => {
    setLoading(true);
    // send actual file objects inside services
    const payload = services.map(({ id, ...rest }) => rest);
    onSubmit(payload);
    setLoading(false);
  };

  const handleRemove = (id) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* HEADER */}
      <Box className="flex items-center pt-4 mt-4 border-t">
        <Typography className="text-24 md:text-24 font-bold tracking-tight leading-none">
          Service Information
        </Typography>
      </Box>

      {isMobile && !showForm ? (
        <Box className="flex justify-center mt-8">
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Add Project
          </Button>
        </Box>
      ) : (
        <div className="relative flex flex-col flex-auto">
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8 mt-8">
            {/* Type */}
            <div className="h-full w-full flex flex-col lg:w-1/5">
              <div className="flex justify-between">
                <FormControl component="fieldset" error={!!errors.type}>
                  <Typography fontSize={14} className="font-medium">
                    Type <span className="text-red-500">*</span>
                  </Typography>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        row
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <FormControlLabel
                          value="product"
                          control={<Radio />}
                          label="Product"
                        />
                        <FormControlLabel
                          value="service"
                          control={<Radio />}
                          label="Service"
                        />
                      </RadioGroup>
                    )}
                  />
                  <FormHelperText>{errors?.type?.message}</FormHelperText>
                </FormControl>
                <div>
                  <Typography fontSize={14} mb={1} className="font-medium">
                    Best Selling
                  </Typography>
                  <Controller
                    name="isBestSelling"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label={field.value ? "Yes" : "No"}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Product/Service Name */}
            <div className="h-full w-full flex flex-col lg:w-2/5">
              <Controller
                name="productName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    label="Product/Service Name"
                    placeholder="Enter the name of the product or service"
                    error={!!errors.productName}
                    helperText={errors?.productName?.message}
                  />
                )}
              />
            </div>

            {/* Currency */}
            <div className="h-full w-full flex flex-col lg:w-1/5">
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.currency}>
                    <InputLabel id="currency-label">Currency</InputLabel>
                    <Select
                      {...field}
                      labelId="currency-label"
                      label="Currency"
                      MenuProps={{ style: { maxHeight: 300 } }}
                    >
                      <MenuItem value="">Choose</MenuItem>
                      {currencyCodes.data.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.currency}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors?.currency?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </div>
            <div className="h-full w-full flex flex-col lg:w-1/5">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    type="number"
                    label="Price"
                    placeholder="Enter the price"
                    error={!!errors.price}
                    helperText={errors?.price?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex justify-center lg:flex-nowrap flex-wrap gap-8 mt-8">
            <div className="h-full w-full flex flex-col">
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <>
                    <label
                      htmlFor="description"
                      className="mb-2 text-sm font-medium text-gray-700"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...field}
                      id="description"
                      placeholder="Enter your description"
                      rows={5}
                      required
                      className={`border rounded-md p-2 text-sm ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                    />
                    {errors?.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          {/* ...other fields remain unchanged... */}

          {/* PRODUCT IMAGE */}
          <div className="h-full w-full lg:w-1/2 mt-8">
            <Typography fontSize={16} mr={8} mb={1} className="text-primary">
              Product Image
            </Typography>
            <div className="h-full w-full flex justify-center">
              <Controller
                name="productImage"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Box
                      component="label"
                      htmlFor="productImage"
                      className="cursor-pointer productImageUpload flex items-center justify-center relative w-56 h-56 rounded-12 mb-16 overflow-hidden shadow hover:shadow-lg"
                    >
                      <input
                        accept="image/*"
                        className="hidden"
                        id="productImage"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          onChange(file);
                        }}
                      />
                      <img
                        className="max-w-none w-auto h-full"
                        src={
                          value instanceof File
                            ? URL.createObjectURL(value)
                            : typeof value === "string" && value
                            ? value
                            : "/images/upload.jpg"
                        }
                        alt={"Image was not found."}
                      />
                    </Box>
                    {value && (
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

          {/* ADD / UPDATE BUTTONS */}
          <div className="flex justify-end py-4 gap-2">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid}
              onClick={handleSubmit(onProductSubmit)}
            >
              {editId ? "Update" : "Add"}
            </Button>
            {editId && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  reset(defaultValues);
                  setEditId(null);
                  if (isMobile) setShowForm(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {/* LIST */}
      {isMobile ? (
        <Box mt={4}>
          {services.map((service) => (
            <Box
              key={service.id}
              className="border p-4 rounded-lg shadow-md mb-4 bg-white"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {service.productName}
              </Typography>
              <Typography variant="body2">Type: {service.type}</Typography>
              <Typography variant="body2">
                Currency: {service.currency}
              </Typography>
              <Typography variant="body2">Price: {service.price}</Typography>
              <Typography variant="body2" className="truncate">
                {service.description}
              </Typography>
              {(service.productImage instanceof File ||
                (typeof service.productImage === "string" &&
                  service.productImage)) && (
                <img
                  src={
                    service.productImage instanceof File
                      ? URL.createObjectURL(service.productImage)
                      : service.productImage
                  }
                  alt=""
                  width={80}
                  height={80}
                  className="mt-2"
                />
              )}
              <Box className="flex justify-end mt-2 gap-2">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShowForm(true);
                    setEditId(service.id);
                    reset(service);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemove(service.id)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <DataGrid
          rows={services}
          columns={columns}
          disableColumnMenu
          disableColumnResize
          pagination={false}
          pageSize={5}
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-cell": {
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "center",
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "1.4",
              padding: "8px",
            },
            "& .MuiDataGrid-columnHeader": {
              justifyContent: "center",
              textAlign: "center",
              whiteSpace: "normal",
            },
          }}
        />
      )}

      <Box className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={handleFormSubmit}
          disabled={services.length === 0 || loading}
        >
          Save & Next
        </Button>
      </Box>
    </>
  );
}

export default ServicesForm;
