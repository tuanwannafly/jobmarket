import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import Loading from "../loading";

const ADMIN_ROLES = ['SUPER_ADMIN'];

const RoleBaseRoute = (props: any) => {
    const user = useAppSelector(state => state.account.user);
    const isLoading = useAppSelector(state => state.account.isLoading);
    const userRole = user.role?.name;

    // ❌ Lỗi cũ: userRole !== 'NORMAL_USER'
    // → bất kỳ role nào không phải NORMAL_USER (HR, MANAGER, CANDIDATE...) đều vào được /admin
    // ✅ Fix: chỉ cho phép các role trong danh sách ADMIN_ROLES
    const isAdmin = userRole && ADMIN_ROLES.includes(userRole.trim());

    if (isLoading) return <Loading />;
    if (isAdmin) return <>{props.children}</>;
    return <Navigate to='/' replace />;
}

const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const isLoading = useAppSelector(state => state.account.isLoading);

    if (isLoading) return <Loading />;
    if (!isAuthenticated) return <Navigate to='/login' replace />;
    return <RoleBaseRoute>{props.children}</RoleBaseRoute>;
}

export default ProtectedRoute;
