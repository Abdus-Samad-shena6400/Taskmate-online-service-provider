import api from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/users/register", // Endpoint for registration
        method: "POST",
        body: userData, // The data to send in the request body
      }),
    }),

    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/users/login", // Endpoint for login
        method: "POST",
        body: userData, // The data to send in the request body
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/users/password/forgot",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `/users/password/reset/${token}`,
        method: "PUT",
        body: { password, confirmPassword },
      }),
    }),

    verifyEmail: builder.mutation({
      query: (userData) => ({
        url: "/users/verify-email", // Endpoint for forgot password
        method: "POST",
        body: userData, // The data to send in the request body
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users/user-data",
        method: "GET",
      }),
      providesTags: ["User"], // Provides the "User" tag
    }),

    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/users/",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"], // Invalidate the "User" tag after mutation
    }),
    

  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = authApi;
