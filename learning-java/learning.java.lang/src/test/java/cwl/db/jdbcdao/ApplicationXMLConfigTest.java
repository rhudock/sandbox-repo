package cwl.db.jdbcdao;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.sql.DataSource;
import java.util.Date;

import static org.mockito.BDDMockito.*;

/**
 * Test class instead XML-based config.
 *
 * @author contact@codercocoon.com
 *
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/jsondao/applicationContext.xml")
public class ApplicationXMLConfigTest {

    DataSource ds = mock(DataSource.class);

    @Autowired
    ExampleDao exampleDao;

    @Autowired
    Example example;

    final String TITLE = "example title";

    /**
     * This test checks if the example is well inserted.
     */
    @Test
    public void testInsertExample() {
        exampleDao.saveExample(example);
        Assert.assertTrue(example.getTitle().equals(exampleDao.getExampleByTitle(TITLE).getTitle()));
    }

    /**
     * This test checks if the example is well updated, the modification of
     * title which is unique, we concatenate it with the date with seconds, to
     * allow running the test many times.
     */
    @Test
    public void testUpdateExample() {
        Example ex = getExample(TITLE);
        ex.setTitle("title modified ".concat(new Date().toString()));
        exampleDao.updateExample(ex);
        ex = exampleDao.getExampleByTitle(TITLE);
        Assert.assertNull(ex);
    }

    /**
     * This test checks if the example is well deleted.
     */
    @Test
    public void testDeleteExample() {
        Example ex = getExample(TITLE);
        exampleDao.deleteExample(ex.getExampleId());
        ex = exampleDao.getExampleByTitle(TITLE);
        Assert.assertNull(ex);
    }

    /**
     * This method insert the example if not exist in the database, the object
     * inserted is the bean "example" which is autowired.
     */
    private Example getExample(String title) {
        Example ex = exampleDao.getExampleByTitle(title);
        if (ex == null) {
            exampleDao.saveExample(example);
            ex = exampleDao.getExampleByTitle(title);
        }
        return ex;
    }
}