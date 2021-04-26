package functions;

public class Output {
    private Integer score;

    public Output() {}

    public Output(Integer shots) {
        this.score = shots * 5;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
