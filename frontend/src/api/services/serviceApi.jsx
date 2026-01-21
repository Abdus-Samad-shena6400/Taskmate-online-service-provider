import { use } from "react";
import api from "../api";

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (serviceData) => ({
        url: "/service/createService", // Endpoint for registration
        method: "POST",
        body: serviceData, // The data to send in the request body
      }),
    }),
    getAllServices: builder.query({
      query: () => ({
        url: `/service/`, // Endpoint for forgot password
        method: "GET",
      }),
    }),
    updateService: builder.mutation({
      query: (service, serviceId) => ({
        url: `/service/${serviceId}`, // Endpoint for forgot password
        method: "PUT",
        body: service, // The data to send in the request body
      }),
    }),
    getServiceById: builder.query({
      query: (serviceId) => ({
        url: `/service/${serviceId}`, // Endpoint for forgot password
        method: "GET",
      }),
    }),
    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `/service/${serviceId}`, // Endpoint to delete the service
        method: "DELETE",
      }),
    }),
    getAllUserServices: builder.query({
      query: () => ({
        url: `/service/consumer-services`, // Endpoint for forgot password
        method: "GET",
      }),
    }),
    getAllProviderServices: builder.query({
      query: () => ({
        url: `/service/provider-services`, // Endpoint for forgot password
        method: "GET",
      }),
    }),
    getProviderServicesById: builder.query({
      query: (providerId) => ({
        url: `/service/provider/services/${providerId}`, // Endpoint for forgot password
        method: "GET",
      }),
    }),
    getConsumerServicesById: builder.query({
      query: (consumerId) => ({
        url: `/service/consumer/services/${consumerId}`, // Endpoint for forgot password
        method: "GET",
      }),
    }),
    markCompleted: builder.mutation({
      query: (serviceId) => ({
        url: `/service/complete-services`,
        method: "PUT",
        body: { serviceId },  // wrap the serviceId in an object
      }),
    }),
    completedServicesForConsumer: builder.query({
      query: () => ({
        url: "/service/consumer/completed-services",
        method: "GET",
      }),
    }),
    submitReview: builder.mutation({
      query: (serviceId, rating, comment) => ({
        url: `/service/consumer/review`,
        method: "PUT",
        body:  serviceId, rating, comment ,  // wrap the serviceId in an object
      }),
    }),
  }),
});

export const {
  useAddServiceMutation,
  useGetAllServicesQuery,
  useDeleteServiceMutation,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
  useGetAllUserServicesQuery,
  useGetAllProviderServicesQuery,
  useGetProviderServicesByIdQuery,
  useGetConsumerServicesByIdQuery,
  useMarkCompletedMutation,
  useCompletedServicesForConsumerQuery,
  useSubmitReviewMutation,
} = serviceApi;
