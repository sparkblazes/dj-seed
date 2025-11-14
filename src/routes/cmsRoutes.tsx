import { Outlet, Route } from "react-router-dom";
import BannerIndex from "../pages/admin/cms/Banners/create";
import CreateBanner from "../pages/admin/cms/Banners/create";
import BlogCategorieIndex from "../pages/admin/cms/BlogCategories/index";
import CreateBlogCategorie from "../pages/admin/cms/BlogCategories/create";
import BlogIndex from "../pages/admin/cms/Blogs/index";
import CreateBlog from "../pages/admin/cms/Blogs/create";
import GallerieIndex from "../pages/admin/cms/Galleries/index";
import CreateGallerie from "../pages/admin/cms/Galleries/create";
import MenuIndex from "../pages/admin/cms/Menus/index";
import CreateMenu from "../pages/admin/cms/Menus/create";
import PageIndex from "../pages/admin/cms/Pages/index";
import CreatePage from "../pages/admin/cms/Pages/create";
import PortfolioCategorieIndex from "../pages/admin/cms/PortfolioCategories/index";
import CreatePortfolioCategorie from "../pages/admin/cms/PortfolioCategories/create";
import PortfolioIndex from "../pages/admin/cms/Portfolios/index";
import CreatePortfolio from "../pages/admin/cms/Portfolios/create";
import PositionIndex from "../pages/admin/cms/Positions/index";
import CreatePosition from "../pages/admin/cms/Positions/create";
import ServiceIndex from "../pages/admin/cms/Services/index";
import CreateService from "../pages/admin/cms/Services/create";

export const CMSRoutes = (
  <Route path="cms" element={<Outlet />}>
    {/* Banner routes */}
    <Route path="banners">
      <Route index element={<BannerIndex />} />
      <Route path="create" element={<CreateBanner />} />
      <Route path="edit/:id" element={<CreateBanner />} />
    </Route>

    <Route path="blog-categories">
      <Route index element={<BlogCategorieIndex />} />
      <Route path="create" element={<CreateBlogCategorie />} />
      <Route path="edit/:id" element={<CreateBlogCategorie />} />
    </Route>

    <Route path="blogs">
      <Route index element={<BlogIndex />} />
      <Route path="create" element={<CreateBlog />} />
      <Route path="edit/:id" element={<CreateBlog />} />
    </Route>

    <Route path="galleries">
      <Route index element={<GallerieIndex />} />
      <Route path="create" element={<CreateGallerie />} />
      <Route path="edit/:id" element={<CreateGallerie />} />
    </Route>

    <Route path="menus">
      <Route index element={<MenuIndex />} />
      <Route path="create" element={<CreateMenu />} />
      <Route path="edit/:id" element={<CreateMenu />} />
    </Route>

    <Route path="pages">
      <Route index element={<PageIndex />} />
      <Route path="create" element={<CreatePage />} />
      <Route path="edit/:id" element={<CreatePage />} />
    </Route>

    <Route path="portfolio-categories">
      <Route index element={<PortfolioCategorieIndex />} />
      <Route path="create" element={<CreatePortfolioCategorie />} />
      <Route path="edit/:id" element={<CreatePortfolioCategorie />} />
    </Route>

    <Route path="portfolios">
      <Route index element={<PortfolioIndex />} />
      <Route path="create" element={<CreatePortfolio />} />
      <Route path="edit/:id" element={<CreatePortfolio />} />
    </Route>

     <Route path="positions">
      <Route index element={<PositionIndex />} />
      <Route path="create" element={<CreatePosition />} />
      <Route path="edit/:id" element={<CreatePosition />} />
    </Route>

    <Route path="services">
      <Route index element={<ServiceIndex />} />
      <Route path="create" element={<CreateService />} />
      <Route path="edit/:id" element={<CreateService />} />
    </Route>
  </Route>
);
