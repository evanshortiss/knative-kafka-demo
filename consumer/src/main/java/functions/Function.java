package functions;

import io.quarkus.funqy.Funq;

public class Function {

    @Funq
    public Output function(Input input) throws InterruptedException {
        String msg = "processed bonus for player: " + input.getBy().getUsername();

        Thread.sleep(500);
        System.out.println(msg);

        return new Output("processed bonus for player: " + input.getBy().getUsername());
    }

}
