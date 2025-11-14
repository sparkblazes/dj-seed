// src/pages/userManagement/user/create.tsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../redux/userManagement/user/userApi";
import { useDropdownRoleQuery } from "../../../redux/userManagement/role/rolesApi";
// import type { CreateUserInput, UpdateUserInput } from "../../../redux/types/userTypes";
import type { CreateUserInput, UpdateUserInput } from "../../../redux/userManagement/user/userTypes";

type UserFormData = CreateUserInput | UpdateUserInput;

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toastRef = useRef<Toast>(null);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: userData } = useGetUserByIdQuery(id!, { skip: !id });

  const { data: rolesData, isLoading: isRolesLoading } = useDropdownRoleQuery({});

  const [profilePreview, setProfilePreview] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({ mode: "onChange" });

  // Prefill user data
  useEffect(() => {
    if (userData?.data) {
      const u = userData.data;
      setValue("name", u.name);
      setValue("email", u.email);
      setValue("phone", u.phone);
      setValue("role_id", u.role_id);
      setValue("plan_id", u.plan_id);
      setValue("language", u.language);
      setValue("timezone", u.timezone);
      setValue("wallet_balance", u.wallet_balance);
      setValue("status", u.status);
      // setValue("last_ip", u.last_ip);

      // Business profile fields
      if (u.business_profile) {
        Object.entries(u.business_profile).forEach(([key, value]) => {
          setValue(`business_profile.${key}` as any, value);
        });
      }

      if (u.profile_pic)
        setProfilePreview({ [crypto.randomUUID()]: u.profile_pic });
      if (u.business_profile?.logo)
        setLogoPreview({ [crypto.randomUUID()]: u.business_profile.logo });
    }
  }, [userData, setValue]);

  // Dropdown options
  const roleOptions =
    rolesData?.data?.map((r: any) => ({
      label: r.name,
      value: r._id,
    })) || [];

  
  // Submit handler
  const onSubmit = async (formData: UserFormData) => {
    const payload = {
      ...formData,
      profile_pic: Object.values(profilePreview)[0] || "",
      business_profile: {
        ...formData.business_profile,
        logo: Object.values(logoPreview)[0] || "",
      },
    };

    try {
      if (id) {
        await updateUser({ id, body: payload as UpdateUserInput }).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "User updated successfully!",
          life: 3000,
        });
      } else {
        await createUser(payload as CreateUserInput).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "User created successfully!",
          life: 3000,
        });
      }
      reset();
      setProfilePreview({});
      setLogoPreview({});
      setTimeout(() => navigate("/users"), 1000);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.data?.message || "Something went wrong",
        life: 4000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {id ? "Update User" : "Create New User"}
              </h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row">
                  {/* Name */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      placeholder="Enter UserName"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      placeholder="Enter phone"
                      {...register("phone", {
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Only numbers allowed",
                        },
                      })}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /\D/g,
                          ""
                        );
                      }}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone.message}
                      </div>
                    )}
                  </div>

                  {/* Password (Create only) */}
                  {!id && (
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        className={`form-control ${errors.password ? "is-invalid" : ""
                          }`}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Min 6 characters",
                          },
                        })}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Role Dropdown */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Role</label>
                    <Dropdown
                      value={watch("role_id")}
                      options={roleOptions}
                      placeholder="Select role"
                      onChange={(e) => setValue("role_id", e.value)}
                      className="w-100"
                      loading={isRolesLoading}
                    />
                  </div>


                  {/* Language */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Language</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter language"
                      {...register("language")}
                    />
                  </div>

                  {/* Timezone */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Timezone</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter timezone"
                      {...register("timezone")}
                    />
                  </div>

                  {/* Wallet Balance */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Wallet Balance</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter wallet balance"
                      {...register("wallet_balance", { valueAsNumber: true })}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Status</label>
                    <Dropdown
                      value={watch("status")}
                      options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Banned", value: "banned" },
                      ]}
                      onChange={(e) => setValue("status", e.value)}
                      placeholder="Select status"
                      className="w-100"
                    />
                  </div>

                  {/* Last IP */}
                  {/* <div className="col-lg-6 mb-3">
                    <label className="form-label">Last IP</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last login IP"
                      {...register("last_ip")}
                      readOnly
                    />
                  </div> */}

                  {/* Business Profile Section */}
                  <div className="col-lg-12 mb-3">
                    <h5>Business Profile</h5>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Business Name</label>
                        <input
                          type="text"
                          placeholder="Enter business name"
                          className="form-control"
                          {...register("business_profile.business_name")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Tagline</label>
                        <input
                          type="text"
                          placeholder="Enter Tagline"
                          className="form-control"
                          {...register("business_profile.tagline")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">About</label>
                        <textarea
                          className="form-control"
                          placeholder="Enter business description"
                          {...register("business_profile.about")}
                        ></textarea>
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="text"
                          placeholder="Enter website URL"
                          className="form-control"
                          {...register("business_profile.website")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Social Links (JSON)</label>
                        <input
                          type="text"
                          placeholder="Enter social links in JSON format"
                          className="form-control"
                          {...register("business_profile.social_links")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          placeholder="Enter address"
                          className="form-control"
                          {...register("business_profile.address")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          className="form-control"
                          {...register("business_profile.city")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          placeholder="Enter state"
                          className="form-control"
                          {...register("business_profile.state")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          placeholder="Enter country"
                          className="form-control"
                          {...register("business_profile.country")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          placeholder="Enter pincode"
                          className="form-control"
                          {...register("business_profile.pincode")}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Contact Person</label>
                        <input
                          type="text"
                          className={`form-control ${errors.business_profile?.contact_person ? "is-invalid" : ""}`}
                          placeholder="Enter contact person"
                          {...register("business_profile.contact_person", {
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "Only numbers allowed",
                            },
                          })}
                          onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                          }}
                        />
                        {errors.business_profile?.contact_person && (
                          <div className="invalid-feedback">
                            {errors.business_profile.contact_person.message}
                          </div>
                        )}
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Contact Info</label>
                        <input
                          type="text"
                          placeholder="Enter contact information"
                          className="form-control"
                          {...register("business_profile.contact_info")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating || isUpdating}
                  >
                    {id
                      ? isUpdating
                        ? "Updating..."
                        : "Update User"
                      : isCreating
                        ? "Creating..."
                        : "Create User"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/users")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
