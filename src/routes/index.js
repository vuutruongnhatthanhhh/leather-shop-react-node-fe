import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import ChangePass from "../pages/ForgotPassPage/ChangePass";
import ForgotPassPage from "../pages/ForgotPassPage/ForgotPassPage";
import OTPPageForgotPass from "../pages/ForgotPassPage/OTPPageForgotPass";
import HomePage from "../pages/HomePage/HomePage";
import MyOrder from "../pages/MyOrderPage/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OTPPage from "../pages/OTPPage/OTPPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SellingPage from "../pages/SellingPage/SellingPage"
import AboutPage from "../pages/AboutPage/AboutPage"
import ContactPage from "../pages/ContactPage/ContactPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        // Hiện header hay không
        isShowHeader: false
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true

    },
    {
        path: '/my-order',
        page: MyOrder,
        isShowHeader: true

    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true

    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
        isShowHeader: true

    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/selling',
        page: SellingPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: false
    },
    {
        path: '/product-details/:id',
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '/otp',
        page: OTPPage,
        isShowHeader: false
    },
    {
        path: '/otp-forgot',
        page: OTPPageForgotPass,
        isShowHeader: false
    },
    {
        path: '/forgot_pass',
        page: ForgotPassPage,
        isShowHeader: false
    },
    {
        path: '/change-pass',
        page: ChangePass,
        isShowHeader: false
    },
    {
        path: '/about',
        page: AboutPage,
        isShowHeader: true
    },
    {
        path: '/contact',
        page: ContactPage,
        isShowHeader: true
    },
    // Khi chọn mấy cái link không có trong đây
    {
        path: '*',
        page: NotFoundPage
    }
]