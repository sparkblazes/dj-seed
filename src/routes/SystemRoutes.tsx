import { Outlet, Route } from "react-router-dom";
import ApiTokenIndex from "../pages/admin/system/ApiTokens/index";
import ApiTokenCreate from "../pages/admin/system/ApiTokens/create";
import DownloadsIndex from "../pages/admin/system/Downloads/index";
import DownloadsCreate from "../pages/admin/system/Downloads/create";
import LanguageIndex from "../pages/admin/system/Languages/index";
import LanguageCreate from "../pages/admin/system/Languages/create";
import SeoSettingIndex from "../pages/admin/system/SeoSettings/index";
import SeoSettingCreate from "../pages/admin/system/SeoSettings/create";
import SettingIndex from "../pages/admin/system/Settings/index";
import SettingCreate from "../pages/admin/system/Settings/create";
import SubscriberIndex from "../pages/admin/system/Subscribers/index";
import SubscriberCreate from "../pages/admin/system/Subscribers/create";
import TranslationIndex from "../pages/admin/system/Translations/index";
import TranslationCreate from "../pages/admin/system/Translations/create";

export const SystemRoutes = (
  <Route path="system" element={<Outlet />}>
    {/* ApiToken routes */}
    <Route path="api-tokens">
      <Route index element={<ApiTokenIndex />} />
      <Route path="create" element={<ApiTokenCreate />} />
      <Route path="edit/:id" element={<ApiTokenCreate />} />
    </Route>

    {/* DownLoads routes */}
    <Route path="downloads">
      <Route index element={<DownloadsIndex />} />
      <Route path="create" element={<DownloadsCreate />} />
      <Route path="edit/:id" element={<DownloadsCreate />} />
    </Route>

    {/* Languages routes */}
    <Route path="languages">
      <Route index element={<LanguageIndex />} />
      <Route path="create" element={<LanguageCreate />} />
      <Route path="edit/:id" element={<LanguageCreate />} />
    </Route>

    {/* SeoSettings routes */}
    <Route path="seosettings">
      <Route index element={<SeoSettingIndex />} />
      <Route path="create" element={<SeoSettingCreate />} />
      <Route path="edit/:id" element={<SeoSettingCreate />} />
    </Route>
    
    {/* Settings routes */}
    <Route path="settings">
      <Route index element={<SettingIndex />} />
      <Route path="create" element={<SettingCreate />} />
      <Route path="edit/:id" element={<SettingCreate />} />
    </Route>

     {/* Subscribers routes */}
    <Route path="subscribers">
      <Route index element={<SubscriberIndex />} />
      <Route path="create" element={<SubscriberCreate />} />
      <Route path="edit/:id" element={<SubscriberCreate />} />
    </Route>

    {/* Translations routes */}
    <Route path="translations">
      <Route index element={<TranslationIndex />} />
      <Route path="create" element={<TranslationCreate />} />
      <Route path="edit/:id" element={<TranslationCreate />} />
    </Route>

  </Route>
);
