import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { authApi } from "./auth/authApi";
import rolesUIReducer from "./userManagement/role/rolesSlice";
import { rolesApi } from "../redux/userManagement/role/rolesApi";
import permissionsUIReducer from "./core/Permissions/permissionsSlice";
import { permissionsApi } from "./core/Permissions/permissionsApi";
import userUIReducer from "../redux/userManagement/user/userSlice";
import { userApi } from "../redux/userManagement/user/userApi";
import { moduleApi } from "./userManagement/module/moduleApi";
import moduleUIReducer from "./userManagement/module/moduleSlice";
import { uploadApi } from "./upload/uploadApi";
import { jobApi } from "./engagement/Jobs/jobApi";
import jobUIReducer from "./engagement/Jobs/jobSlice";
import { contactsApi } from "./engagement/Contacts/contactsApi";
import contactsUIReducer from "./engagement/Contacts/contactsSlice";
import { eventApi } from "./engagement/Events/eventApi";
import eventUIReducer from "./engagement/Events/eventSlice";
import { applicationApi } from "./engagement/Applications/applicationApi";
import applicationUIReducer from "./engagement/Applications/applicationSlice";
import { bannerApi } from "./cms/Banners/bannerApi";
import bannerUIReducer from "./cms/Banners/bannerSlice";
import { blogCategorieApi } from "./cms/BlogCategories/blogCategorieApi";
import blogcaterieUIReducer from "./cms/BlogCategories/blogCategorieSlice";
import { blogApi } from "./cms/Blogs/blogApi";
import blogUIReducer from "./cms/Blogs/blogSlice";
import { gallerieApi } from "./cms/Galleries/gallerieApi";
import gallerieUIReducer from "./cms/Galleries/gallerieSlice";
import { menuApi } from "./cms/Menus/menuApi";
import menuUIReducer from "./cms/Menus/menuSlice";
import { pageApi } from "./cms/Pages/pageApi";
import pageUIReducer from "./cms/Pages/pageSlice";
import { portfolioCategorieApi } from "./cms/PortfolioCategories/portfolioCategorieApi";
import portfolioCategorieUIReducer from "./cms/PortfolioCategories/portfolioCategorieSlice";
import { portfolioApi } from "./cms/Portfolios/portfolioApi";
import portfolioUIReducer from "./cms/Portfolios/portfolioSlice";
import { serviceApi } from "./cms/Services/serviceApi";
import serviceUIReducer from "./cms/Services/serviceSlice";
import { orderApi } from "./ecommerce/Orders/orderApi";
import orderUIReducer from "./ecommerce/Orders/orderSlice";
import { paymentApi } from "./ecommerce/Payments/paymentApi";
import paymentUIReducer from "./ecommerce/Payments/paymentSlice";
import { productCategorieApi } from "./ecommerce/ProductCategories/productCategorieApi";
import productCategorieUIReducer from "./ecommerce/ProductCategories/productCategorieSlice";
import { productApi } from "./ecommerce/Products/productApi";
import productUIReducer from "./ecommerce/Products/productSlice";
import { ticketApi } from "./support/Tickets/ticketApi";
import ticketUIReducer from "./support/Tickets/ticketSlice";
import { faqCategoriesApi } from "./engagement/FaqCategories/faqCategoriesApi";
import faqCategoriesUIReducer from "./engagement/FaqCategories/faqCategoriesSlice";
import { faqApi } from "./engagement/Faqs/faqApi";
import faqsUIReducer from "./engagement/Faqs/faqSlice";
import { testimonialApi } from "./engagement/Testimonials/testimonialApi";
import testimonialUIReducer from "./engagement/Testimonials/testimonialSlice";
import { apiTokenApi } from "./system/ApiTokens/apiTokenApi";
import apiTokenUIReducer from "./system/ApiTokens/apiTokenSlice";
import { downloadApi } from "./system/Downloads/downloadApi";
import downloadUIReducer from "./system/Downloads/downloadSlice";
import { languageApi } from "./system/Languages/languageApi";
import languageUIReducer from "./system/Languages/languageSlice";
import { seoSettingApi } from "./system/SeoSettings/seoSettingApi";
import seoSettingUIReducer from "./system/SeoSettings/seoSettingSlice";
import { settingApi } from "./system/Settings/settingApi";
import settingUIReducer from "./system/SeoSettings/seoSettingSlice";
import { subscriberApi } from "./system/Subscribers/subscriberApi";
import subscriberUIReducer from "./system/Subscribers/subscriberSlice";
import { qrGenerateApi } from "./qr-generate/QRGenerateApi";
import QRGenerateUIReducer from "./qr-generate/QRGenerateSlice";
import { translationApi } from "./system/Translations/translationApi";
import translationUIReducer from "./system/Translations/translationSlice";
// import { permissionsApi } from "./core/Permissions/permissionsApi";
// import permissionsUIReducer from "./core/Permissions/permissionsSlice";
import { bookingApi } from "./booking/bookingApi";
import bookingUIReducer from "./booking/bookingSlice";
import { positionApi } from "./cms/Positions/positionApi";
import positionUIReducer from "./cms/Positions/positionSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        rolesUI: rolesUIReducer,
        permissionsUI: permissionsUIReducer,
        userUI: userUIReducer,
        moduleUI: moduleUIReducer,
        jobUI: jobUIReducer,
        contactsUI: contactsUIReducer,
        eventUI: eventUIReducer,
        applicationUI: applicationUIReducer,
        bannerUI: bannerUIReducer,
        blogcategorieUI: blogcaterieUIReducer,
        blogUI: blogUIReducer,
        gallerieUI: gallerieUIReducer,
        menuUI: menuUIReducer,
        pageUI: pageUIReducer,
        portfolioCategorieUI: portfolioCategorieUIReducer,
        portfolioUI: portfolioUIReducer,
        serviceUI: serviceUIReducer,
        orderUI: orderUIReducer,
        paymentUI: paymentUIReducer,
        productCategorieUI: productCategorieUIReducer,
        productUI: productUIReducer,
        ticketUI: ticketUIReducer,
        faqCategoriesUI: faqCategoriesUIReducer,
        faqUI: faqsUIReducer,
        testimonialUI: testimonialUIReducer,
        apiTokenUI: apiTokenUIReducer,
        downloadUI: downloadUIReducer,
        languageUI: languageUIReducer,
        seoSettingUI: seoSettingUIReducer,
        settingUI: settingUIReducer,
        subscriberUI: subscriberUIReducer,
        QRGenerateUI: QRGenerateUIReducer,
        translationUI: translationUIReducer,
        bookingsUI: bookingUIReducer,
        positionsUI: positionUIReducer,


        [authApi.reducerPath]: authApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [permissionsApi.reducerPath]: permissionsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [uploadApi.reducerPath]: uploadApi.reducer,
        [moduleApi.reducerPath]: moduleApi.reducer,
        [jobApi.reducerPath]: jobApi.reducer,
        [contactsApi.reducerPath]: contactsApi.reducer,
        [eventApi.reducerPath]: eventApi.reducer,
        [applicationApi.reducerPath]: applicationApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [blogCategorieApi.reducerPath]: blogCategorieApi.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [gallerieApi.reducerPath]: gallerieApi.reducer,
        [menuApi.reducerPath]: menuApi.reducer,
        [pageApi.reducerPath]: pageApi.reducer,
        [portfolioCategorieApi.reducerPath]: portfolioCategorieApi.reducer,
        [portfolioApi.reducerPath]: portfolioApi.reducer,
        [serviceApi.reducerPath]: serviceApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [productCategorieApi.reducerPath]: productCategorieApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [ticketApi.reducerPath]: ticketApi.reducer,

        [faqCategoriesApi.reducerPath]: faqCategoriesApi.reducer,
        [faqApi.reducerPath]: faqApi.reducer,
        [testimonialApi.reducerPath]: testimonialApi.reducer,
        [apiTokenApi.reducerPath]: apiTokenApi.reducer,
        [downloadApi.reducerPath]: downloadApi.reducer,
        [languageApi.reducerPath]: languageApi.reducer,
        [seoSettingApi.reducerPath]: seoSettingApi.reducer,
        [settingApi.reducerPath]: settingApi.reducer,
        [subscriberApi.reducerPath]: subscriberApi.reducer,
        [qrGenerateApi.reducerPath]: qrGenerateApi.reducer,
        [translationApi.reducerPath]: translationApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        [positionApi.reducerPath]: positionApi.reducer,





    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(rolesApi.middleware)
            .concat(permissionsApi.middleware)
            .concat(userApi.middleware)
            .concat(uploadApi.middleware)
            .concat(moduleApi.middleware)
            .concat(jobApi.middleware)
            .concat(contactsApi.middleware)
            .concat(eventApi.middleware)
            .concat(applicationApi.middleware)
            .concat(bannerApi.middleware)
            .concat(blogCategorieApi.middleware)
            .concat(blogApi.middleware)
            .concat(gallerieApi.middleware)
            .concat(menuApi.middleware)
            .concat(pageApi.middleware)
            .concat(portfolioCategorieApi.middleware)
            .concat(portfolioApi.middleware)
            .concat(serviceApi.middleware)
            .concat(orderApi.middleware)
            .concat(paymentApi.middleware)
            .concat(productCategorieApi.middleware)
            .concat(productApi.middleware)
            .concat(ticketApi.middleware)
            .concat(faqCategoriesApi.middleware)
            .concat(faqApi.middleware)
            .concat(testimonialApi.middleware)
            .concat(apiTokenApi.middleware)
            .concat(downloadApi.middleware)
            .concat(languageApi.middleware)
            .concat(seoSettingApi.middleware)
            .concat(settingApi.middleware)
            .concat(subscriberApi.middleware)
            .concat(qrGenerateApi.middleware)
            .concat(translationApi.middleware)
            .concat(permissionsApi.middleware)
            .concat(bookingApi.middleware)
            .concat(positionApi.middleware)


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;