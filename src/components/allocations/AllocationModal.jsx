import React from "react";
import { Modal } from "../common/Modal";
import { AllocationForm } from "../../forms/AllocationForm";

export const AllocationModal = ({
  isOpen,
  onClose,
  InStockAssets = [],
  employees = [],
  loadingEmployees = false,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Asset to Staff">
      <AllocationForm
        InStockAssets={InStockAssets}
        employees={employees}
        loadingEmployees={loadingEmployees}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};
