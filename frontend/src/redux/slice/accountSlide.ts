import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount } from '@/config/api';

export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data;
    }
)

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id?: string;
            name?: string;
            permissions?: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    };
    activeMenu: string;
}

const ROLE_KEY = 'user_role';

const getSavedRole = () => {
    try {
        const saved = localStorage.getItem(ROLE_KEY);
        return saved ? JSON.parse(saved) : { id: '', name: '', permissions: [] };
    } catch {
        return { id: '', name: '', permissions: [] };
    }
};

const initialState: IState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: {
        id: "",
        email: "",
        name: "",
        role: getSavedRole(), // ✅ đọc role từ localStorage ngay khi khởi tạo
    },
    activeMenu: 'home'
};

export const accountSlide = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.id;
            state.user.email = action.payload.email;
            state.user.name = action.payload.name;
            state.user.role = action?.payload?.role ?? {};
            state.user.role.permissions = action?.payload?.role?.permissions ?? [];
            // ✅ Lưu role vào localStorage để dùng sau khi reload
            if (action?.payload?.role) {
                localStorage.setItem(ROLE_KEY, JSON.stringify(action.payload.role));
            }
        },
        setLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            localStorage.removeItem(ROLE_KEY);
            state.isAuthenticated = false;
            state.user = {
                id: "",
                email: "",
                name: "",
                role: { id: "", name: "", permissions: [] },
            }
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            // ✅ BUG FIX: phải check action.payload?.user, không chỉ action.payload
            // Nếu chỉ check action.payload → error response {statusCode, message} cũng truthy
            // → isAuthenticated = true nhưng role rỗng → RoleBaseRoute redirect về /
            const userData = action.payload?.user;
            if (userData) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user.id = userData.id;
                state.user.email = userData.email;
                state.user.name = userData.name;

                const roleFromBE = userData.role;
                if (roleFromBE) {
                    // ✅ BUG FIX: không check roleFromBE.name nữa
                    // Nếu check roleFromBE.name → BE không trả name thì role không được update
                    // → fallback về localStorage/initialState có thể rỗng → redirect /
                    state.user.role = {
                        id: roleFromBE.id ?? state.user.role.id,
                        name: roleFromBE.name ?? state.user.role.name,
                        permissions: roleFromBE.permissions ?? state.user.role.permissions ?? [],
                    };
                    if (roleFromBE.name) {
                        localStorage.setItem(ROLE_KEY, JSON.stringify(state.user.role));
                    }
                }
            } else {
                // ✅ BUG FIX: payload không hợp lệ → luôn phải tắt loading
                // Nếu để isLoading = true mãi → ProtectedRoute hiện Loading vô tận
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        })
        builder.addCase(fetchAccount.rejected, (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            localStorage.removeItem(ROLE_KEY);
        })
    },
});

export const {
    setActiveMenu, setUserLoginInfo, setLogoutAction, setRefreshTokenAction
} = accountSlide.actions;

export default accountSlide.reducer;
