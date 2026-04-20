package in.arogyanexa.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;         // seconds until access token expires
    private UUID uuid;
    private String email;
    private String fullName;
    private Set<String> roles;

    // Set to true when MFA is required but not yet verified
    private Boolean mfaRequired;

    // Temporary token used only for MFA verification step
    private String mfaSessionToken;
}
