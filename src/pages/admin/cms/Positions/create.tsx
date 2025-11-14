import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
    useCreatePositionMutation,
    useUpdatePositionMutation,
    useFetchPositionByIdQuery,
} from "../../../../../redux/cms/Positions/positionApi";

const PositionsCreate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: position, isLoading } = useFetchPositionByIdQuery(id ? String(id) : "0", {
        skip: !id,
    });
    const [createPosition] = useCreatePositionMutation();
    const [updatePosition] = useUpdatePositionMutation();

    const [formData, setFormData] = useState<any>({
        name: "",
        width: "",
        height: "",
        left: "",
        right: "",

    });

    // ✅ state for backend validation errors
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Populate form when editing
    useEffect(() => {
        if (position && id) {
            setFormData({
                name: position?.data?.name || "",
                width: position?.data?.width || "",
                height: position?.data?.height || "",
                left: position?.data?.left || "",
                right: position?.data?.right || "",
            });
        }
    }, [position, id]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            width: "",
            height: "",
            left: "",
            right: "",
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // clear old errors
        try {
            if (id) {
                await updatePosition({ uuid: String(id), positionData: formData }).unwrap();
                resetForm(); // ✅ reset form after update
            } else {
                await createPosition(formData).unwrap();
                resetForm(); // ✅ reset form after create
            }
            navigate("/cms/positions");
        } catch (err: any) {
            // ✅ catch Laravel-style 422 validation errors
            if (err?.status === 422 && err.data?.errors) {
                setErrors(err.data.errors);
            } else {
                console.error("Submit error", err);
            }
        }
    };

    return (
        <>
            <Breadcrumb
                title={id ? "Edit Position" : "Create Position"}
                items={[
                    { label: "Dashboard", href: "/admin" },
                    { label: "Positions", href: "/cms/positions" },
                    { label: id ? "Edit" : "Create", active: true },
                ]}
            />

            <div className="row">
                <div className="col-md-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <p>Loading...</p>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Name */}
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">{errors.name[0]}</div>
                                        )}
                                    </div>

                                    {/* Width */}
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="width">Width</label>
                                        <input
                                            type="text"
                                            id="width"
                                            placeholder="Width"
                                            className="form-control"
                                            value={formData.width}
                                            onChange={handleChange}
                                        />
                                        {errors.width && (
                                            <div className="invalid-feedback d-block">{errors.width[0]}</div>
                                        )}
                                    </div>

                                    {/* Height */}
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="height">Height</label>
                                        <input
                                            type="text"
                                            id="height"
                                            placeholder="Height"
                                            className="form-control"
                                            value={formData.height}
                                            onChange={handleChange}
                                        />
                                        {errors.height && (
                                            <div className="invalid-feedback d-block">{errors.height[0]}</div>
                                        )}
                                    </div>

                                    {/* Left */}
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="left">Left</label>
                                        <input
                                            type="text"
                                            id="left"
                                            placeholder="Left"
                                            className="form-control"
                                            value={formData.left}
                                            onChange={handleChange}
                                        />
                                        {errors.left && (
                                            <div className="invalid-feedback d-block">{errors.left[0]}</div>
                                        )}
                                    </div>

                                    {/* Right */}
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="right">Right</label>
                                        <input
                                            type="text"
                                            id="right"
                                            placeholder="Right"
                                            className="form-control"
                                            value={formData.right}
                                            onChange={handleChange}
                                        />
                                        {errors.right && (
                                            <div className="invalid-feedback d-block">{errors.right[0]}</div>
                                        )}
                                    </div>


                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary">
                                        {id ? "Update" : "Submit"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => navigate("/cms/positions")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PositionsCreate;
