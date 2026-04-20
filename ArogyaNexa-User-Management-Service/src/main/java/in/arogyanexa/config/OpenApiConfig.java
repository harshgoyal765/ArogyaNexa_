package in.arogyanexa.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI (Swagger) configuration for API documentation.
 * Access at: http://localhost:8081/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Value("${app.base-url:http://localhost:8081}")
    private String baseUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()
            .info(new Info()
                .title("ArogyaNexa User Management Service API")
                .version("1.0.0")
                .description("""
                    Complete IAM (Identity & Access Management) service with:
                    - JWT-based authentication
                    - Role-based access control (RBAC)
                    - Multi-factor authentication (MFA/TOTP)
                    - Refresh token rotation
                    - Password reset flow
                    - Account locking & security audit
                    
                    **Authentication Flow:**
                    1. Register: POST /api/v1/auth/register
                    2. Login: POST /api/v1/auth/login (returns access + refresh tokens)
                    3. Use access token in Authorization header: Bearer {token}
                    4. Refresh: POST /api/v1/auth/refresh (when access token expires)
                    """)
                .contact(new Contact()
                    .name("ArogyaNexa Team")
                    .email("support@arogyanexa.in")
                    .url("https://arogyanexa.in"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
            .servers(List.of(
                new Server().url(baseUrl).description("Local Development"),
                new Server().url("https://api.arogyanexa.in").description("Production")
            ))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Enter JWT token obtained from /api/v1/auth/login")));
    }
}
