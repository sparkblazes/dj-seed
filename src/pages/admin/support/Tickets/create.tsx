import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useFetchTicketByIdQuery,
} from "../../../../../redux/support/Tickets/ticketApi";

const TicketsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ticket, isLoading } = useFetchTicketByIdQuery(id ? Number(id) : 0, {
    skip: !id,
  });
  const [createTicket] = useCreateTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();

  const [formData, setFormData] = useState<any>({
    // user_id: "",
    assigned_to: "",
    // department_id: "",
    // category_id: "",
    ticket_number: "",
    subject: "",
    message: "",
    priority: "",
    status: 1,
    due_date: "",
    resolved_at: "",
    response_time: "",
    resolution_time: "",
    attachments: "",
    source: "",
    replies_count: "",
    views_count: 0,
    is_locked: false,
  });

  // Populate form when editing
  useEffect(() => {
    if (ticket && id) setFormData(ticket);
  }, [ticket, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;

    setFormData({ ...formData, [id]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateTicket({ id: Number(id), ticketData: formData }).unwrap();
    } else {
      await createTicket(formData).unwrap();
    }
    navigate("/support/tickets");
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Ticket" : "Create Ticket"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tickets", href: "/support/tickets" },
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
                  {/* User ID
                  <div className="col-md-6 form-group">
                    <label htmlFor="user_id">User ID</label>
                    <input
                      type="text"
                      id="user_id"
                      className="form-control"
                      value={formData.user_id}
                      onChange={handleChange}
                    />
                  </div> */}

                  {/* Assigned To */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="assigned_to">Assigned To</label>
                    <input
                      type="text"
                      id="assigned_to"
                      className="form-control"
                      value={formData.assigned_to}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Department ID */}
                  {/* <div className="col-md-6 form-group">
                    <label htmlFor="department_id">Department ID</label>
                    <input
                      type="text"
                      id="department_id"
                      className="form-control"
                      value={formData.department_id}
                      onChange={handleChange}
                    />
                  </div> */}

                  {/* Category ID */}
                  {/* <div className="col-md-6 form-group">
                    <label htmlFor="category_id">Category ID</label>
                    <input
                      type="text"
                      id="category_id"
                      className="form-control"
                      value={formData.category_id}
                      onChange={handleChange}
                    />
                  </div> */}

                  {/* Ticket Number */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="ticket_number">Ticket Number</label>
                    <input
                      type="text"
                      id="ticket_number"
                      className="form-control"
                      value={formData.ticket_number}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Subject */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Message */}
                  <div className="col-md-12 form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      className="form-control"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Priority */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="priority">Priority</label>
                    <input
                      type="text"
                      id="priority"
                      className="form-control"
                      value={formData.priority}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <input
                      type="text"
                      id="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Due Date */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="due_date">Due Date</label>
                    <input
                      type="date"
                      id="due_date"
                      className="form-control"
                      value={formData.due_date}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Resolved At */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="resolved_at">Resolved At</label>
                    <input
                      type="date"
                      id="resolved_at"
                      className="form-control"
                      value={formData.resolved_at}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Response Time */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="response_time">Response Time</label>
                    <input
                      type="text"
                      id="response_time"
                      className="form-control"
                      value={formData.response_time}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Resolution Time */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="resolution_time">Resolution Time</label>
                    <input
                      type="text"
                      id="resolution_time"
                      className="form-control"
                      value={formData.resolution_time}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Attachments */}
                  <div className="col-md-12 form-group">
                    <label htmlFor="attachments">Attachments</label>
                    <input
                      type="file"
                      id="attachments"
                      className="form-control"
                      value={formData.attachments}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Source */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="source">Source</label>
                    <input
                      type="text"
                      id="source"
                      className="form-control"
                      value={formData.source}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Replies Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="replies_count">Replies Count</label>
                    <input
                      type="number"
                      id="replies_count"
                      className="form-control"
                      value={formData.replies_count}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Views Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count</label>
                    <input
                      type="number"
                      id="views_count"
                      className="form-control"
                      value={formData.views_count}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Is Locked */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_locked">Is Locked</label>
                    <input
                      type="checkbox"
                      id="is_locked"
                      checked={formData.is_locked}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/support/tickets")}
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

export default TicketsCreate;
