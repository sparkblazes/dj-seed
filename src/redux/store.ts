import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { authApi } from "./auth/authApi";
import rolesUIReducer from "../redux/userManagement/role/rolesSlice";
import { rolesApi } from "../redux/userManagement/role/rolesApi";
import permissionsUIReducer from "../redux/userManagement/permissions/permissionsSlice";
import { permissionsApi } from "../redux/userManagement/permissions/permissionsApi";
import userUIReducer from "../redux/userManagement/user/userSlice";
import { userApi } from "../redux/userManagement/user/userApi";
import { moduleApi } from "./userManagement/module/moduleApi";
import moduleUIReducer from "./userManagement/module/moduleSlice";
import { uploadApi } from "./upload/uploadApi";
import uploadReducer from "./upload/uploadSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        rolesUI: rolesUIReducer,
        permissionsUI: permissionsUIReducer,
        userUI: userUIReducer,


        moduleUI: moduleUIReducer,


        [authApi.reducerPath]: authApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [permissionsApi.reducerPath]: permissionsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,

        [uploadApi.reducerPath]: uploadApi.reducer,

        [moduleApi.reducerPath]: moduleApi.reducer,






    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(rolesApi.middleware)
            .concat(permissionsApi.middleware)
            .concat(userApi.middleware)
            .concat(uploadApi.middleware)

            .concat(moduleApi.middleware)



});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;