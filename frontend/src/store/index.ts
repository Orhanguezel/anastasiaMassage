// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./user/authSlice";
import profileReducer from "./user/profileSlice";
import userCrudReducer from "./user/userCrudSlice";
import userStatusReducer from "./user/userStatusSlice";
import cartReducer from "./cartSlice";
import servicesReducer from "./servicesSlice";
import appointmentsReducer from "./appointmentsSlice";
import productsReducer from "./productsSlice";
import ordersReducer from "./ordersSlice";
import blogReducer from "./blogSlice";
import notificationReducer from "./notificationSlice";
import feedbackReducer from "./feedbackSlice";
import settingsReducer from "./settingsSlice";
import emailReducer from "./emailSlice";
import galleryReducer from "./gallerySlice";
import faqReducer from "./faqSlice";
import couponReducer from "./couponSlice";
import stockReducer from "./stockSlice";
import dashboardReducer from "./dashboardSlice";
import accountReducer from "./accountSlice";
import contactReducer from "./contactMessageSlice";
import chatReducer from "./chatSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    userCrud: userCrudReducer,
    userStatus: userStatusReducer,
    cart: cartReducer,
    services: servicesReducer,
    appointments: appointmentsReducer,
    products: productsReducer,
    orders: ordersReducer,
    blog: blogReducer,
    notifications: notificationReducer,
    feedback: feedbackReducer,
    settings: settingsReducer,
    email: emailReducer,
    gallery: galleryReducer,
    faq: faqReducer,
    coupon: couponReducer,
    stocks: stockReducer,
    dashboard: dashboardReducer,
    account: accountReducer,
    contactMessage:contactReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
