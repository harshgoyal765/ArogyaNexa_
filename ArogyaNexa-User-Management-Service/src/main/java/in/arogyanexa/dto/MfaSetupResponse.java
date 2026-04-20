package in.arogyanexa.dto;

 

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MfaSetupResponse {

    private String secret;          // Base32 secret to show user
    private String qrCodeUri;       // otpauth:// URI for QR code generation
    private String qrCodeImage;     // Base64 encoded QR code PNG
}
