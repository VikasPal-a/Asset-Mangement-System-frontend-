import { useEffect, useMemo, useState } from "react";
import { AlertCircle, MapPin, RefreshCw } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";

import reportService from "../../services/reportService";

const LocationSummary = () => {
  const [locationStock, setLocationStock] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationAssets, setLocationAssets] = useState([]);
  const [locationAssetCount, setLocationAssetCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await reportService.getLocationStockSummary();

      if (response?.success) {
        setLocationStock(response?.data || []);
      } else {
        setLocationStock([]);
        setError(response?.message || "Unable to load locations.");
      }
    } catch (err) {
      console.error("Location summary error:", err);
      setLocationStock([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load locations.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationAssets = async (locationId) => {
    if (!locationId) {
      setLocationAssets([]);
      setLocationAssetCount(0);
      return;
    }

    try {
      setLocationLoading(true);
      setLocationError("");

      const response = await reportService.getLocationAssets(locationId);

      if (response?.success) {
        setLocationAssets(response?.data || []);
        setLocationAssetCount(response?.totalAssets || 0);
      } else {
        setLocationAssets([]);
        setLocationAssetCount(0);
        setLocationError(
          response?.message || "Unable to load location assets.",
        );
      }
    } catch (err) {
      console.error("Location assets error:", err);
      setLocationAssets([]);
      setLocationAssetCount(0);
      setLocationError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load location assets.",
      );
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchLocationAssets(selectedLocation);
    } else {
      setLocationAssets([]);
      setLocationAssetCount(0);
      setLocationError("");
    }
  }, [selectedLocation]);

  const locations = useMemo(() => {
    return locationStock.map((item, index) => ({
      id: `${item.LocationName}-${index}`,
      name: item.LocationName,
      totalAssets: Number(item.TotalAssets || 0),
    }));
  }, [locationStock]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const assetColumns = [
    {
      field: "AssetTag",
      headerName: "Asset Tag",
      minWidth: 160,
      flex: 1,
    },
    {
      field: "AssetName",
      headerName: "Asset Name",
      minWidth: 220,
      flex: 1.3,
    },
    {
      field: "SerialNumber",
      headerName: "Serial Number",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "Status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => {
        const status = String(params.value || "");
        let statusClass = "bg-gray-100 text-gray-700 border-gray-200";

        if (status.toLowerCase() === "InStock") {
          statusClass = "bg-green-50 text-green-700 border-green-200";
        }

        if (status.toLowerCase() === "assigned") {
          statusClass = "bg-blue-50 text-blue-700 border-blue-200";
        }

        if (status.toLowerCase() === "maintenance") {
          statusClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
        }

        if (status.toLowerCase() === "decommissioned") {
          statusClass = "bg-red-50 text-red-700 border-red-200";
        }

        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass}`}
          >
            {status || "-"}
          </span>
        );
      },
    },
    {
      field: "Price",
      headerName: "Price",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => {
        if (
          params.value === null ||
          params.value === undefined ||
          params.value === ""
        ) {
          return "-";
        }

        return formatCurrency(params.value);
      },
    },
    {
      field: "WarrantyExpiryDate",
      headerName: "Warranty Expiry",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return "-";

        const date = new Date(params.value);

        if (Number.isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("en-IN");
      },
    },
  ];

  const assetRows = useMemo(() => {
    return locationAssets.map((asset) => ({
      id: asset.AssetID,
      AssetID: asset.AssetID,
      AssetTag: asset.AssetTag || "-",
      AssetName: asset.AssetName || "-",
      SerialNumber: asset.SerialNumber || "-",
      Status: asset.Status || "-",
      Price: asset.Price,
      WarrantyExpiryDate: asset.WarrantyExpiryDate,
    }));
  }, [locationAssets]);

  const handleRefresh = async () => {
    await fetchLocations();

    if (selectedLocation) {
      await fetchLocationAssets(selectedLocation);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Summary</h1>
          <p className="text-sm text-gray-500 mt-1">
            View individual assets available at a selected location
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading || locationLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loading || locationLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Unable to load locations</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Location Asset Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a location to view its assets
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              disabled={loading}
              className="min-w-[230px] px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Location</option>

              {locations.map((location) => (
                <option key={location.id} value={getLocationId(location.name)}>
                  {location.name}
                </option>
              ))}
            </select>

            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-500 mr-2">Total Assets:</span>
              <span className="text-sm font-bold text-gray-900">
                {locationAssetCount}
              </span>
            </div>
          </div>
        </div>

        {locationError && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {locationError}
          </div>
        )}

        {!selectedLocation && (
          <div className="h-[450px] flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl">
            <MapPin className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">
              Select a location
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Select a location to view its assets
            </p>
          </div>
        )}

        {selectedLocation && (
          <div className="w-full">
            <div className="h-[500px] w-full">
              <DataGrid
                rows={assetRows}
                columns={assetColumns}
                loading={locationLoading}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                      page: 0,
                    },
                  },
                }}
                sx={{
                  border: "1px solid #e5e7eb",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f9fafb",
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: "13px",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Current location-stock API returns LocationName + TotalAssets,
// but does not return LocationID. Keep these IDs synchronized
// with your database until LocationID is added to that API.
const getLocationId = (locationName) => {
  const locationMap = {
    Delhi: 3,
    "Delhi Office": 3,
    Gurugram: 4,
    "Gurugram Office": 4,
    Moradabad: 5,
    Warehouse: 6,
    panipat: 3,
  };

  return locationMap[locationName] || "";
};

export default LocationSummary;
