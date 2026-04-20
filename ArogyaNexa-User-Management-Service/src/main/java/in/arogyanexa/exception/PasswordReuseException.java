package in.arogyanexa.exception;

 

public class PasswordReuseException extends RuntimeException {
    public PasswordReuseException(String message) { super(message); }
}

