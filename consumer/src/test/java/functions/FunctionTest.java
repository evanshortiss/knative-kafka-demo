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
    final static String json = "{\"match\":\"qnSwtjPzSO6tf4kNDmn3V\",\"game\":\"w38nSZQmG8ZlroWU6tiD-\",\"by\":{\"username\":\"Charm Snagglefoot\",\"uuid\":\"ntySV2RY5VNIOphGGWdnZ\"},\"shots\":3,\"human\":false}";

    @Test
    void testFunction() throws JsonMappingException, JsonProcessingException, InterruptedException {
        ObjectMapper objectMapper = new ObjectMapper();
        Input input = objectMapper.readValue(json, Input.class);
        Output output = (new Function()).function(input);
        System.out.println(output.getScore());
        Assertions.assertEquals(output.getScore(), 15);
    }

    @Test
    public void testFunctionIntegration() {
        RestAssured.given().contentType("application/json")
                .body(json)
                .header("ce-id", "42")
                .header("ce-specversion", "1.0")
                .post("/")
                .then().statusCode(200)
                .body("score", equalTo(15));
    }

}
