package com.example.ims_invoice.ui;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ims_invoice.R;
import com.example.ims_invoice.api.ApiService;
import com.example.ims_invoice.api.RetrofitClient;
import com.example.ims_invoice.models.LoginRequest;
import com.example.ims_invoice.models.LoginResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    private static final String BASE_URL = "https://your-api-base-url.com" ;
    private EditText emailEditText;
    private EditText passwordEditText;
    private Button loginButton;
    private TextView tokenTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        emailEditText = findViewById(R.id.email);
        passwordEditText = findViewById(R.id.password);
        loginButton = findViewById(R.id.loginButton);
        tokenTextView = findViewById(R.id.token);

        loginButton.setOnClickListener(v -> login());
    }

    private void login() {
        String email = emailEditText.getText().toString();
        String password = passwordEditText.getText().toString();

        ApiService apiService = RetrofitClient.getClient(BASE_URL).create(ApiService.class);
        Call<LoginResponse> call = apiService.login(new LoginRequest(email, password));
        call.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if (response.isSuccessful()) {
                    tokenTextView.setText(response.body().getToken());
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                // Handle error
            }
        });
    }
}
