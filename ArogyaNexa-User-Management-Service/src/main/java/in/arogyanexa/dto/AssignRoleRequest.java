package in.arogyanexa.dto;

 

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class AssignRoleRequest {

    @NotEmpty(message = "At least one role must be specified")
    private Set<String> roles;
}
