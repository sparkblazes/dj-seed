import { Outlet, Route } from "react-router-dom";
import TicketIndex from "../pages/admin/support/Tickets/index";
import CreateTicket from "../pages/admin/support/Tickets/create";   



export const SupportRoutes = (
    <Route path="support" element={<Outlet />}>
      
      <Route path="ticket">
      <Route index element={<TicketIndex />} />
      <Route path="create" element={<CreateTicket />} />
      <Route path="edit/:id" element={<CreateTicket />} />
    </Route>

    </Route>
);