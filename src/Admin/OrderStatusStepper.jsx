import React from "react";
import { format, isValid } from "date-fns";
import "./OrderStatusStepper.css";

const OrderStatusStepper = ({ statusHistory, createdAt, currentStatus }) => {
  const steps = [
    { label: "Placed", status: "Placed" },
    { label: "Accepted", status: "Accepted" },
    { label: "Ready", status: "Ready" },
    { label: "On the way", status: "On the way" },
    { label: "Delivered", status: "Delivered" },
    { label: "Rejected", status: "Rejected" },
  ];

  let filteredSteps = [];
  if (statusHistory?.some((status) => status.status === "Rejected")) {
    filteredSteps = steps.filter(
      (step) => step.status === "Placed" || step.status === "Rejected"
    );
  } else {
    filteredSteps = steps.filter((step) => step.status !== "Rejected");
  }

  // Ensure 'Placed' step is always completed
  const completedSteps = ["Placed"];

  return (
    <div className="status-stepper">
      {filteredSteps.map((step, index) => {
        const stepStatus = statusHistory?.find(
          (status) => status.status === step.status
        );
        const isActive =
          completedSteps.includes(step.status) ||
          (stepStatus && stepStatus.status === step.status);

        const createdAtDate = new Date(createdAt);
        const stepStatusDate = stepStatus ? new Date(stepStatus.timestamp) : null;

        return (
          <div key={index} className={`step ${isActive ? "active" : ""}`}>
            <div className="step-completion">{isActive ? "✓" : index + 1}</div>
            <div className="step-details">
              <div className="step-title">
                <span>{step.label}</span>
              </div>
              {step.label === "Placed" && isValid(createdAtDate) && (
                <div className="step-timestamp">
                  {format(createdAtDate, "hh:mm a")}
                </div>
              )}
              {stepStatus && step.label !== "Placed" && isValid(stepStatusDate) && (
                <div className="step-timestamp">
                  {format(stepStatusDate, "hh:mm a")}
                </div>
              )}
            </div>
            {index < filteredSteps.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;
