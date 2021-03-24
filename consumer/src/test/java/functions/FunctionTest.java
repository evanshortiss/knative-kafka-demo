package functions;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.equalTo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@QuarkusTest
public class FunctionTest {
    final static String json = "{\"orderId\":\"8eecdbca-c17f-448d-b3e8-8f34e5388a00\",\"firstname\":\"Max\",\"lastname\":\"Lueilwitz\",\"address\":{\"name\":\"Max Lueilwitz\",\"street\":\"0823 Annabell Wall\",\"unit\":\"Suite 226\",\"city\":\"Marcelinoton\",\"country\":\"Slovenia\",\"zipcode\":\"96466-5558\"},\"email\":\"Max_Lueilwitz@example.com\",\"phone\":\"1-267-559-6370 x023\",\"product\":{\"id\":\"6d15877c-2ffa-40fc-825b-d0f97cc0f9b2\",\"department\":\"Industrial\",\"price\":\"377.00\",\"quantity\":1},\"total\":377,\"datetime\":\"2021-03-15T22:36:23.038Z\"}";
    @Test
    void testFunction() throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Input input = objectMapper.readValue(json, Input.class);
        Output output = (new Function()).function(input);
        Assertions.assertEquals("8eecdbca-c17f-448d-b3e8-8f34e5388a00", output.getMessage());
    }

    @Test
    public void testFunctionIntegration() {
        RestAssured.given().contentType("application/json")
                .body("{\"orderId\": \"Hello\"}")
                .header("ce-id", "42")
                .header("ce-specversion", "1.0")
                .post("/")
                .then().statusCode(200)
                .body("message", equalTo("received order: Hello"));
    }

}
