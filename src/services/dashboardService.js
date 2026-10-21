import { assetService } from "./assetService";
import { ASSET_STATUS } from "../utils/constants";

export const dashboardService = {
  getDashboardStats() {
    const assets = assetService.getAssets();
    return {
      total: assets.length,
      available: assets.filter((a) => a.status === ASSET_STATUS.InStock).length,
      assigned: assets.filter((a) => a.status === ASSET_STATUS.ASSIGNED).length,
      maintenance: assets.filter((a) => a.status === ASSET_STATUS.MAINTENANCE)
        .length,
    };
  },
};
