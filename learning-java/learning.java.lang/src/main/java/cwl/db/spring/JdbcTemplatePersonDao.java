package cwl.db.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class JdbcTemplatePersonDao implements Dao<Person> {
    @Autowired
    private DataSource dataSource;
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    private void postConstruct() {
        jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public long save(Person person) {
        String sql = "insert into Person (first_Name, Last_Name, Address) values (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql, new String[]{"ID"});
                    ps.setString(1, person.getFirstName());
                    ps.setString(2, person.getLastName());
                    ps.setString(3, person.getAddress());
                    return ps;
                }, keyHolder);
        Number key = keyHolder.getKey();
        return key.longValue();
    }

    @Override
    public Person load(long id) {
        List<Person> persons = jdbcTemplate.query("select * from Person where id =?",
                new Object[]{id}, (resultSet, i) -> {
                    return toPerson(resultSet);
                });

        if (persons.size() == 1) {
            return persons.get(0);
        }
        return null;
    }

    @Override
    public int delete(long id) {
        return jdbcTemplate.update("delete from PERSON where id = ?", id);
    }

    @Override
    public int update(Person person) {
        String updateSql = "UPDATE Person SET FIRST_NAME = ?, LAST_NAME = ?, "
                + "ADDRESS = ? WHERE id = ?";
        return jdbcTemplate.update(updateSql, person.getFirstName(), person.getLastName(),
                person.getAddress(), person.getId());
    }

    @Override
    public List<Person> loadAll() {
        return jdbcTemplate.query("select * from Person", (resultSet, i) -> {
            return toPerson(resultSet);
        });
    }

    private Person toPerson(ResultSet resultSet) throws SQLException {
        Person person = new Person();
        person.setId(resultSet.getLong("ID"));
        person.setFirstName(resultSet.getString("FIRST_NAME"));
        person.setLastName(resultSet.getString("LAST_NAME"));
        person.setAddress(resultSet.getString("ADDRESS"));
        return person;
    }

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }
}