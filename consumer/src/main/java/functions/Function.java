package functions;

import io.quarkus.funqy.Funq;

public class Function {

    @Funq
    public Output function(Input input) {
        String msg = "processed order: " + input.getOrderId();
        System.out.println(msg);
        return new Output("processed order: " + input.getOrderId());
    }

}
