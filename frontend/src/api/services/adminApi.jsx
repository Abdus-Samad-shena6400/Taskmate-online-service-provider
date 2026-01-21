import api from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminData: builder.query({
      query: () => ({
        url: `/admin/`,
        method: "GET",
      }),
    }),
    allConsumers: builder.query({
      query: () => ({
        url: `/admin/all-consumers`,
        method: "GET",
      }),
    }),
    allProviders: builder.query({
      query: () => ({
        url: `/admin/all-providers`,
        method: "GET",
      }),
    }),
    unAssignedServices: builder.query({
      query: () => ({
        url: `/admin/unassigned-services`,
        method: "GET",
      }),
    }),
    completedServices: builder.query({
      query: () => ({
        url: `/admin/completed-services`,
        method: "GET",
      }),
    }),
    assignedSerivces: builder.query({
      query: () => ({
        url: `/admin/assigned-services`,
        method: "GET",
      }),
      providesTags: ["assignedServices"],  // <-- This marks the cached data with this tag
    }),

    assignToProvider: builder.mutation({
      query: ({ serviceID, providerID }) => ({
        url: "/admin/assign-service",
        method: "PUT",
        body: {
          serviceID,
          providerID,
        },
      }),
    }),
    unAssignService: builder.mutation({
      query: (serviceId) => ({
        url: `/admin/un-assigned-services`,
        method: "PUT",
        body: { serviceId },
      }),
      invalidatesTags: ["assignedServices"],
    }),
    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `/admin//delete-service/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
    addAdmin: builder.mutation({
      query: (adminData) => ({
        url: `/admin/add-admin`,
        method: "POST",
        body: adminData,
      }),
    }),

  }),
});

export const {
  useAdminDataQuery,
  useAllConsumersQuery,
  useAllProvidersQuery,
  useUnAssignedServicesQuery,
  useCompletedServicesQuery,
  useAssignedSerivcesQuery,
  useAssignToProviderMutation,
  useUnAssignServiceMutation,
  useDeleteServiceMutation,
  useAddAdminMutation,
} = authApi;
