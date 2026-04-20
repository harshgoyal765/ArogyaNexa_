package in.arogyanexa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableDiscoveryClient
@EnableAsync         // For async audit logging and email sending
@EnableScheduling   // For token cleanup scheduled tasks
public class ArogyaNexaUserManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArogyaNexaUserManagementServiceApplication.class, args);
	}

}
