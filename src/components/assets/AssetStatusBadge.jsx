import React from "react";
import { Badge } from "../common/Badge";
import { ASSET_STATUS } from "../../utils/constants";

export const AssetStatusBadge = ({ status }) => {
  switch (status) {
    case ASSET_STATUS.InStock:
      return (
        <Badge variant="success" className="text-[10px]">
          InStock
        </Badge>
      );

    case ASSET_STATUS.ASSIGNED:
      return (
        <Badge variant="info" className="text-[10px]">
          Assigned
        </Badge>
      );

    case ASSET_STATUS.MAINTENANCE:
      return (
        <Badge variant="warning" className="text-[10px]">
          Maintenance
        </Badge>
      );

    default:
      return (
        <Badge variant="default" className="text-[10px]">
          {status}
        </Badge>
      );
  }
};
