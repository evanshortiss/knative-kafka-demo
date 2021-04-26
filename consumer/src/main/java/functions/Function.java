package functions;

import org.jboss.logging.Logger;
import io.quarkus.funqy.Funq;

public class Function {
    private static final Logger Log = Logger.getLogger(Function.class);

    @Funq
    public Output function(Input input) throws InterruptedException {
        Thread.sleep(500);
        Output output = new Output(input.getShots());

        Log.infov("User {0} scored {1} points", input.getBy().getUsername(), output.getScore());

        return output;
    }

}
