package cwl.db.jdbcdao;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.List;

/**
 * The DAO implementation.
 *
 * @author contact@codercocoon.com
 *
 */
public class ExampleDaoImpl extends JdbcDaoSupport implements ExampleDao {

    /**
     * This method selects all examples from the database.
     */
    @Override
    public List<Example> getAllExamples() {
        String sql = "SELECT * FROM EXAMPLE";
        List<Example> examples = getJdbcTemplate().queryForList(sql, null,
                new BeanPropertyRowMapper<Example>(Example.class));
        return examples;
    }

    /**
     * This method gets an example from the database by its title.
     * BeanPropertyRowMapper is just magic stuff that he maps fields from the
     * database table to the target object.
     */
    @Override
    public Example getExampleByTitle(String title) {
        String sql = "SELECT * FROM EXAMPLE WHERE TITLE = ?";
        Object[] params = new Object[] { title };
        Example ex = null;
        try {
            ex = (Example) getJdbcTemplate().queryForObject(sql, params,
                    new BeanPropertyRowMapper<Example>(Example.class));
        } /*
             * If no rows found, Spring throws an exception, so we catch the
             * exception to return null.
             */
        catch (EmptyResultDataAccessException e) {
            return ex;
        }
        return ex;
    }

    /**
     * This method inserts an example in the database.
     */
    @Override
    public void saveExample(Example ex) {
        String sql = "INSERT INTO EXAMPLE (TITLE, DESCRIPTION) VALUES (?, ?)";
        getJdbcTemplate().update(sql, new Object[] { ex.getTitle(), ex.getDescription() });
    }

    /**
     * This method updates an example in the database by its ID.
     */
    @Override
    public void updateExample(Example ex) {
        String sql = "UPDATE EXAMPLE SET TITLE = ?, DESCRIPTION = ? WHERE EXAMPLE_ID = ?";
        getJdbcTemplate().update(sql, new Object[] { ex.getTitle(), ex.getDescription(), ex.getExampleId() });
    }

    /**
     * This method deletes an example from the database by its ID.
     */
    @Override
    public void deleteExample(int id_ex) {
        String sql = "DELETE FROM EXAMPLE WHERE EXAMPLE_ID = ?";
        getJdbcTemplate().update(sql, new Object[] { id_ex });
    }
}