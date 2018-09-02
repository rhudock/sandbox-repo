package cwl.db.jdbcdao;
import java.util.List;

/**
 * The DAO Interface.
 *
 * @author contact@codercocoon.com
 *
 */
public interface ExampleDao {

    /**
     * Gets all examples in the database.
     *
     * @return a list of examples.
     */
    List<Example> getAllExamples();

    /**
     * Gets an example by its title.
     *
     * @param title
     *            : is unique constraint.
     * @return the example having the title parameter.
     */
    Example getExampleByTitle(String title);

    /**
     * Saves the example passed in the parameter.
     *
     * @param ex
     */
    void saveExample(Example ex);

    /**
     * Updates the example passed in the parameter.
     *
     * @param ex
     */
    void updateExample(Example ex);

    /**
     * Deletes the example which has the ID passed in the parameter.
     *
     * @param id_ex
     */
    void deleteExample(int id_ex);
}