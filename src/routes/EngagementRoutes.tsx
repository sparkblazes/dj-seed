import { Outlet, Route } from "react-router-dom";
import ApplicationsIndex from "../pages/admin/engagement/Applications/index";
import ApplicationsCreate from "../pages/admin/engagement/Applications/create";
import JobsIndex from "../pages/admin/engagement/Jobs/index";
import JobsCreate from "../pages/admin/engagement/Jobs/create";
import ContactsIndex from "../pages/admin/engagement/Contacts/index";
import ContactsCreate from "../pages/admin/engagement/Contacts/create";
import EventsIndex from "../pages/admin/engagement/Events/index";
import EventsCreate from "../pages/admin/engagement/Events/create";
import FaqsCategoriesIndex from "../pages/admin/engagement/FaqsCategories/index";
import FaqsCategoriesCreate from "../pages/admin/engagement/FaqsCategories/create";
import FaqsIndex from "../pages/admin/engagement/Faqs/index";
import FaqsCreate from "../pages/admin/engagement/Faqs/create";
import TestimonialsIndex from "../pages/admin/engagement/Testimonials/index";
import TestimonialsCreate from "../pages/admin/engagement/Testimonials/create";

export const EngagementRoutes = (
  <Route path="engagement" element={<Outlet />}>
    {/* Applications routes */}
    <Route path="applications">
      <Route index element={<ApplicationsIndex />} />
      <Route path="create" element={<ApplicationsCreate />} />
      <Route path="edit/:id" element={<ApplicationsCreate />} />
    </Route>

    {/* Jobs routes */}
    <Route path="jobs">
      <Route index element={<JobsIndex />} />
      <Route path="create" element={<JobsCreate />} />
      <Route path="edit/:id" element={<JobsCreate />} />
    </Route>

    {/* Contacts routes */}
    <Route path="contacts">
      <Route index element={<ContactsIndex />} />
      <Route path="create" element={<ContactsCreate />} />
      <Route path="edit/:id" element={<ContactsCreate />} />
    </Route>

    {/* Events routes */}
    <Route path="events">
      <Route index element={<EventsIndex />} />
      <Route path="create" element={<EventsCreate />} />
      <Route path="edit/:id" element={<EventsCreate />} />
    </Route>
    
    {/* FaqCategories routes */}
    <Route path="faqCategories">
      <Route index element={<FaqsCategoriesIndex />} />
      <Route path="create" element={<FaqsCategoriesCreate />} />
      <Route path="edit/:id" element={<FaqsCategoriesCreate />} />
    </Route>

     {/* Faq routes */}
    <Route path="faqs">
      <Route index element={<FaqsIndex />} />
      <Route path="create" element={<FaqsCreate />} />
      <Route path="edit/:id" element={<FaqsCreate />} />
    </Route>

    {/* Testimonials routes */}
    <Route path="testimonials">
      <Route index element={<TestimonialsIndex />} />
      <Route path="create" element={<TestimonialsCreate />} />
      <Route path="edit/:id" element={<TestimonialsCreate />} />
    </Route>

  </Route>
);
