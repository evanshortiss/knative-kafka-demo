package functions;

import io.quarkus.funqy.Funq;

public class Function {

    @Funq
    public Output function(Input input) {
        String msg = "processed bonus for player: " + input.getBy().getUsername();
        System.out.println(msg);
        return new Output("processed bonus for player: " + input.getBy().getUsername());
    }

}
