package in.arogyanexa.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse {

    private UUID uuid;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private boolean mfaEnabled;
    private boolean emailVerified;
    private Set<String> roles;
    private Set<String> permissions;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private boolean passwordExpired;
}

