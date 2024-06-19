package com.example.ims_invoice.api;

import com.example.ims_invoice.models.CreateUserResponse;
import com.example.ims_invoice.models.DeleteUserResponse;
import com.example.ims_invoice.models.LoginRequest;
import com.example.ims_invoice.models.LoginResponse;
import com.example.ims_invoice.models.LogoutResponse;
import com.example.ims_invoice.models.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {
    @POST("/auth/login")
    Call<LoginResponse> login(@Body LoginRequest loginRequest);

    @POST("/auth/logout")
    Call<LogoutResponse> logout();

    @POST("/users")
    Call<CreateUserResponse> createUser(@Body User user);

    @GET("/users/{userId}")
    Call<User> getUser(@Path("userId") String userId);

    @PUT("/users/{userId}")
    Call<User> updateUser(@Path("userId") String userId, @Body User user);

    @DELETE("/users/{userId}")
    Call<DeleteUserResponse> deleteUser(@Path("userId") String userId);

    // Add other API calls to continue from here
}