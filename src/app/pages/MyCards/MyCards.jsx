import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axiosInstance from "../../services/utils/axiosIntance";
import FormService from "../../services/FormService";
import { useDeleteDigitalCardMutation } from "../../services/api/CustomerApi";
import { isAdmin } from "../../redux/features/Auth/AuthSlice";

const MyCards = React.memo(() => {
  const navigate = useNavigate();
  const isUserAdmin = useSelector(isAdmin);
  const [cards, setCards] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const [deleteDigitalCard] = useDeleteDigitalCardMutation();

  const handleCreateNew = () => {
    navigate("/create-card");
  };
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const handlePaginationModelChange = useCallback((newModel) => {
    setPaginationModel(newModel);
  }, []);
  const confirmDelete = () => {
    setCards(cards.filter((card) => card._id !== selectedCard._id));
    deleteDigitalCard(selectedCard._id);
    setDeleteDialog(false);
    setSelectedCard(null);
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return <Typography>{index + 1}</Typography>;
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {params.row.companyInfo.name}
        </Typography>
      ),
    },
    {
      field: "businessName",
      headerName: "Business Name",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {params.row.companyInfo.businessName}
        </Typography>
      ),
    },
    {
      field: "qrCodes",
      headerName: "QR",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row.qrCode ? (
          <Box display="flex" justifyContent="center" width="100%">
            <img
              src={params.row.qrCode}
              alt="QR"
              style={{ height: 30, width: 30, cursor: "pointer" }}
              onClick={() => {
                setSelectedCard(params.row);
                setQrDialogOpen(true);
              }}
            />
          </Box>
        ) : (
          "-"
        ),
    },

    {
      field: "link",
      headerName: "Link",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          component="a"
          href={`${import.meta.env.VITE_APP_CARD_FRONTEND_URL}/${
            params.row.slug
          }`}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <LinkIcon color="primary" />
        </IconButton>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <IconButton
            size="medium"
            onClick={() => {
              setSelectedCard(params.row);
              getCustomer(params.row);
            }}
          >
            <InfoOutlinedIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="medium"
            onClick={() => {
              setSelectedCard(params.row);
              navigate(`/edit-card/${params.row.slug}`);
            }}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          {isUserAdmin && (
            <IconButton
              size="medium"
              onClick={() => {
                setSelectedCard(params.row);
                setDeleteDialog(true);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const handleDownloadQR = () => {
    if (!selectedCard?.qrCode) return;

    const link = document.createElement("a");
    link.href = selectedCard.qrCode;
    link.download = `${
      selectedCard?.companyInfo?.businessName || "qr-code"
    }.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCustomer = (rawData) => {
    axios
      .get(`api/users/user/${rawData.customerId}`)
      .then((res) => {
      
        setCustomer(res.data.user);
        setShareDialog(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const getAllCustomers = () => {
    axiosInstance
      .get(`api/customer/getAll`)
      .then((res) => {
        setCards(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  const filteredCards = cards.filter(
    (card) =>
      card?.companyInfo?.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      card?.companyInfo?.businessName
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            My Digital Cards
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your digital business cards
          </Typography>
        </Box>
        {isUserAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{ minWidth: 150 }}
          >
            Create New Card
          </Button>
        )}
      </Box>

      {/* Search Bar */}
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Name or Business Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      {/* Data Grid */}
    <DataGrid
  rows={filteredCards}
  columns={columns}
  disableColumnMenu
  disableColumnResize
  pagination
  paginationModel={paginationModel}
  onPaginationModelChange={handlePaginationModelChange}
  pageSizeOptions={[5, 10, 25, 50]}
  getRowId={(row) => row._id}
  autoHeight
  disableRowSelectionOnClick
  sx={{
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "transparent !important",
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-cell:focus-within": {
      outline: "none",
    },
    "& .MuiDataGrid-cell:focus-visible": {
      outline: "none",
    },
    "& .MuiDataGrid-cell:active": {
      backgroundColor: "transparent !important",
    },
    "& .MuiDataGrid-columnHeader:focus": {
      outline: "none",
    },
  }}
/>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete"
            {selectedCard?.companyInfo?.businessName}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialog}
        onClose={() => setShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Card</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            <strong>Email :</strong> {customer?.email}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Password :</strong> {customer?.rowPass}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setShareDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>QR Code</DialogTitle>

        <DialogContent>
          <Card
            elevation={3}
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 2,
            }}
          >
            {/* Header bar */}
            <Box
              sx={{
                background: "#1976d2",
                color: "white",
                py: 1.5,
                borderRadius: "8px 8px 0 0",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {selectedCard?.companyInfo?.businessName}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Logo */}
              {selectedCard?.companyInfo?.logoImage && (
                <img
                  src={selectedCard.companyInfo.logoImage}
                  alt="Logo"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    borderRadius: "50%",
                    marginBottom: 16,
                  }}
                />
              )}

              {/* QR Code */}
              <img
                src={selectedCard?.qrCode}
                alt="QR"
                style={{
                  width: 150,
                  height: 150,
                  marginBottom: 16,
                }}
              />
            </Box>

            {/* Instruction */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Scan to connect with{" "}
              <strong>{selectedCard?.companyInfo?.businessName}</strong>
            </Typography>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
               // flexDirection: { xs: "column", sm: "row" }, // Stack buttons vertically on small screens
                justifyContent: "center",
                gap: 1,
                mt: 3,
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.875rem" }, // Smaller text on mobile
                  padding: { xs: "4px 8px", sm: "6px 16px" },
                }}
              >
                Download Template
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadQR}
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                  padding: { xs: "4px 8px", sm: "6px 16px" },
                }}
              >
                Download QR
              </Button>                                   

              <Button
                variant="outlined"
                onClick={() => setQrDialogOpen(false)}
              
              >
                Close
              </Button>
            </Box>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default MyCards;
