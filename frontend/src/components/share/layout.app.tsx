import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLogoutAction, setRefreshTokenAction } from "@/redux/slice/accountSlide";
import { message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}

const LayoutApp = (props: IProps) => {
    const isRefreshToken = useAppSelector(state => state.account.isRefreshToken);
    const errorRefreshToken = useAppSelector(state => state.account.errorRefreshToken);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isRefreshToken === true) {
            message.error(errorRefreshToken);

            // ✅ BUG FIX: phải dispatch setLogoutAction TRƯỚC KHI navigate('/login')
            // Nếu không clear isAuthenticated → LoginPage thấy isAuthenticated=true
            // → LoginPage redirect về '/' ngay lập tức → user bị đẩy về Home thay vì Login
            dispatch(setLogoutAction({}));
            dispatch(setRefreshTokenAction({ status: false, message: "" }));
            navigate('/login');
        }
    }, [isRefreshToken]);

    return (
        <>
            {props.children}
        </>
    )
}

export default LayoutApp;