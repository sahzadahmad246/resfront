// FilteredOrders.js
import React, { useEffect } from "react";
import { format } from "date-fns";

const FilteredOrders = ({ orders, activeStatus, searchTerm, users, setFilteredOrders }) => {
  useEffect(() => {
    const filterOrders = () => {
      let filtered = [...orders];

      // Filter by status
      if (activeStatus !== "All") {
        filtered = filtered.filter((order) => {
          if (activeStatus === "Undelivered") {
            return order.orderStatus === "cancelled" || order.orderStatus === "Rejected";
          }
          return order.orderStatus === activeStatus;
        });
      }

      // Filter by search term
      if (searchTerm.trim() !== "") {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        filtered = filtered.filter((order) => {
          const { user, deliveryInfo, _id } = order;
          const userName = users[user]?.name.toLowerCase();
          const userPhone = deliveryInfo.phone.toLowerCase();
          return (
            userName.includes(normalizedSearchTerm) ||
            userPhone.includes(normalizedSearchTerm) ||
            _id.toLowerCase().includes(normalizedSearchTerm)
          );
        });
      }

      // Sort by created date
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFilteredOrders(filtered);
    };

    filterOrders();
  }, [activeStatus, searchTerm, orders, users, setFilteredOrders]);

  return null; // This component only handles filtering logic and doesn't render any JSX
};

export default FilteredOrders;
