// src/pages/userManagement/user/index.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useDeleteMultipleUsersMutation,
} from "../../../../redux/userManagement/user/userApi";
import CommonDataTable from "../../../../components/common/SingleDataTable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

interface BusinessProfile {
  business_name?: string;
  tagline?: string;
  about?: string;
  logo?: string;
  website?: string;
  social_links?: Record<string, string>;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contact_person?: string;
  contact_info?: string;
}

interface UserRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profile_pic?: string;
  role_name?: string;
  plan_name?: string;
  language?: string;
  timezone?: string;
  wallet_balance?: number;
  status?: string;
  last_login?: string;
  last_ip?: string;
  device_tokens?: string[];
  business_name?: string;
  website?: string;
  contact_person?: string;
}

const UserIndex: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);

  const { data, isLoading, refetch } = useGetUsersQuery({ page: 1, limit: 10 });
  const [deleteUser] = useDeleteUserMutation();
  const [deleteMultipleUsers] = useDeleteMultipleUsersMutation();

  // 🧩 Flatten data safely
  const flattenedData: UserRow[] =
    data?.data?.users?.map((u: any) => ({
      _id: u._id,
      name: u.name || "-",
      email: u.email || "-",
      phone: u.phone || "-",
      profile_pic: u.profile_pic || "-",
      role_name: u.role_id?.name || u.role_id || "-",
      plan_name: u.plan_id?.name || u.plan_id || "-",
      language: u.language || "-",
      timezone: u.timezone || "-",
      wallet_balance: u.wallet_balance ?? 0,
      status: u.status || "-",
      last_login: u.last_login
        ? new Date(u.last_login).toLocaleString("en-GB")
        : "-",
      last_ip: u.last_ip || "-",
      device_tokens: u.device_tokens || [],
      business_name: u.business_profile?.business_name || "-",
      website: u.business_profile?.website || "-",
      contact_person: u.business_profile?.contact_person || "-",
    })) || [];

  // 🗑️ Delete single user
  const handleDelete = async (user: UserRow) => {
    try {
      await deleteUser(user._id).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "User deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete user",
        life: 3000,
      });
    }
  };

  // 🧹 Delete multiple users
  const handleMultiDelete = async (selectedUsers: UserRow[]) => {
    try {
      const ids = selectedUsers.map((u) => u._id);
      await deleteMultipleUsers({ ids }).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Selected users deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete selected users",
        life: 3000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />

      <CommonDataTable<UserRow>
        title="Users"
        data={flattenedData}
        columns={[
          { field: "_id", header: "ID" },
          { field: "name", header: "Name" },
          { field: "email", header: "Email" },
          { field: "phone", header: "Phone" },
          { field: "profile_pic", header: "Profile Picture", image: true },
          { field: "role_name", header: "Role" },
          { field: "plan_name", header: "Plan" },
          { field: "language", header: "Language" },
          { field: "timezone", header: "Timezone" },
          { field: "wallet_balance", header: "Wallet Balance" },
          { field: "status", header: "Status" },
          { field: "last_login", header: "Last Login" },
          { field: "last_ip", header: "Last IP" },
          {
            field: "device_tokens",
            header: "Device Tokens",
            body: (row: UserRow) => row.device_tokens?.join(", ") || "-",
          },
          { field: "business_name", header: "Business Name" },
          { field: "website", header: "Website" },
          { field: "contact_person", header: "Contact Person" },
        ]}
        onAdd={() => navigate("/users/create")}
        onEdit={(user) => navigate(`/users/edit/${user._id}`)}
        onDelete={handleDelete}
        onDeleteMultiple={handleMultiDelete}
        enableDeleteSelected={true}
      />

      <div className="mt-3 text-end">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          onClick={() => refetch()}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default UserIndex;
