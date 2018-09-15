

package com.inq.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.sql.DataSource;

import com.inq.DBITestCase;
import com.inq.model.SiteAgentDataSecureKey;
import org.junit.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import static junit.framework.Assert.assertNotNull;
import static org.junit.Assert.*;
import static org.mockito.BDDMockito.*;


/**
 *
 * http://codercocoon.com/spring-jdbcdaosupport/
 */
public class SiteAgentDataSecureKeyDAOTest extends DBITestCase {

    @Test
    public void testInsertChangeLog() {
        SiteAgentDataSecureKey siteAgentDataSecureKey = new SiteAgentDataSecureKey();
        siteAgentDataSecureKey.setId(1);
        siteAgentDataSecureKey.setSiteId(1);
        siteAgentDataSecureKey.setActive(true);
        siteAgentDataSecureKey.setPublicKey("PublicKey");
        siteAgentDataSecureKey.setPrivateKey("PrivateKey");

        JdbcTemplate template = new JdbcTemplate();
        final List test = new ArrayList();
        JdbcDaoSupport dao = new JdbcDaoSupport() {
            protected void initDao() {
                test.add("test");
            }
        };
        dao.setJdbcTemplate(template);

        SiteAgentDataSecureKeyDAO changeLogDao = handle.attach(SiteAgentDataSecureKeyDAO.class);
        SiteAgentDataSecureKey siteAgentDataSecureKey2 = changeLogDao.getSiteAgentDataSecureKeyBySite("1").iterator().next();
        assertNotNull(siteAgentDataSecureKey2);
    }

    @Override
    public String createSql() {
        return "CREATE TABLE `site_agent_data_secure_key` (\n" +
                "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n" +
                "  `active` TINYINT(1) NULL,\n" +
                "  `site_id` INT(11) NOT NULL,\n" +
                "  `public_key` TEXT NULL,\n" +
                "  `private_key` TEXT NULL,\n" +
                "  PRIMARY KEY (`id`),\n" +
                "  UNIQUE INDEX `site_id_UNIQUE` (`site_id` ASC),\n" +
                "  UNIQUE INDEX `id_UNIQUE` (`id` ASC));"
                + "INSERT INTO `site_agent_data_secure_key` (`active`,`site_id`, `public_key`, `private_key`) VALUES ('1', '100', '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');"
                ;
    }

    @Override
    public String dropSql() {
        return "DROP TABLE `site_agent_data_secure_key`;";
    }
}