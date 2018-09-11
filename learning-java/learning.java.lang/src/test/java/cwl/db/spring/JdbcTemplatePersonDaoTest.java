package cwl.db.spring;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.jdbc.JdbcTestUtils;

import java.util.List;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = AppConfig.class)
public class JdbcTemplatePersonDaoTest {

    @Autowired
    private Dao<Person> personDao;

    @Test
    public void testCrudOperations() {
        JdbcTestUtils.deleteFromTables(personDao.getJdbcTemplate(), "PERSON");

        //insert
        Person person = Person.create("Dana", "Whitley", "464 Gorsuch Drive");
        long generatedId = personDao.save(person);
        System.out.println("Generated Id: " + generatedId);

        //read
        Person loadedPerson = personDao.load(generatedId);
        System.out.println("Loaded Person: " + loadedPerson);
        Assert.assertNotNull(loadedPerson);
        Assert.assertTrue("Dana".equals(loadedPerson.getFirstName()));

        int c = JdbcTestUtils.countRowsInTable(personDao.getJdbcTemplate(), "PERSON");
        Assert.assertTrue(c == 1);

        //updating address
        Person toBeUpdated = Person.create("Dana", "Whitley", "345 Move Dr, Shine Hill");
        toBeUpdated.setId(generatedId);
        int updated = personDao.update(toBeUpdated);
        Assert.assertTrue(updated==1);

        //read again
        Person loadedPerson2 = personDao.load(generatedId);
        System.out.println("Loaded Person after update: " + loadedPerson2);
        Assert.assertNotNull(loadedPerson2);
        Assert.assertTrue("345 Move Dr, Shine Hill".equals(loadedPerson2.getAddress()));

        //loading all
        List<Person> list = personDao.loadAll();
        System.out.println("All loaded: " + list);
        Assert.assertTrue(list.size() == 1);

        //delete
        int affectedRows = personDao.delete(generatedId);
        Assert.assertTrue(affectedRows == 1);

        c = JdbcTestUtils.countRowsInTable(personDao.getJdbcTemplate(), "PERSON");
        Assert.assertTrue(c == 0);
    }
}