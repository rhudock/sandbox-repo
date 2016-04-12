package me.dlee.jsql.ex;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statements;
import net.sf.jsqlparser.statement.delete.Delete;
import net.sf.jsqlparser.statement.insert.Insert;
import net.sf.jsqlparser.statement.select.Select;

public class StatementsTest {

	public StatementsTest() {
	}

	@BeforeClass
	public static void setUpClass() {
	}

	@AfterClass
	public static void tearDownClass() {
	}

	@Before
	public void setUp() {
	}

	@After
	public void tearDown() {
	}

	/**
	 * Test of toString method, of class Statements.
	 */
	@Test
	public void testStatementsSelect() throws JSQLParserException {
		String sqls = "select * from mytable; select * from mytable2;";
		Statements parseStatements = CCJSqlParserUtil.parseStatements(sqls);

		assertEquals("SELECT * FROM mytable;\nSELECT * FROM mytable2;\n", parseStatements.toString());

		assertTrue(parseStatements.getStatements().get(0) instanceof Select);
		assertTrue(parseStatements.getStatements().get(1) instanceof Select);
	}

	@Test
	public void testStatementsDelete() throws JSQLParserException {
		String sqls = "delete from configuration.role_privileges where privID in (5,6,130,131);";
		Statements parseStatements = CCJSqlParserUtil.parseStatements(sqls);

		assertTrue(parseStatements.getStatements().get(0) instanceof Delete);
	}

	@Test
	public void testStatementsInsert() throws JSQLParserException {
		String sqls = "insert into configuration.role_privileges (privID, roleID) values (5, 1);";
		Statements parseStatements = CCJSqlParserUtil.parseStatements(sqls);

		assertTrue(parseStatements.getStatements().get(0) instanceof Insert);
	}

	@Test
	public void testStatementsProblem02() throws JSQLParserException {
		try {
			List<File> sqlFileNames = getFileList();
			assertTrue(sqlFileNames.size() > 0);

			for (File sqlFile : sqlFileNames) {
				List<String> statements = readFileLineByLine(sqlFile);
				// assertTrue(statements.size() > 0);
				
				for(String s: statements) {
					testStatements(s);
				}
			}
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public String testStatements(String sqls) throws JSQLParserException {
		System.out.println("testing " + sqls);
		Statements parseStatements = CCJSqlParserUtil.parseStatements(sqls);

		return parseStatements.toString();
	}	

	public List<File> getFileList() throws IOException {
		File dir = new File("src/branch/sql");

		System.out.println("Getting all files in " + dir.getCanonicalPath() + " including those in subdirectories");
		List<File> files = (List<File>) FileUtils.listFiles(dir, TrueFileFilter.INSTANCE, TrueFileFilter.INSTANCE);
		for (File file : files) {
			
			System.out.println("file: " + file.getCanonicalPath());
		}
		return files;
	}

	private static final String[] STATEMENT_TYPES = { "select", "insert", "update" };

	public List<String> readFileLineByLine(File file) {

		List<String> statements = new LinkedList<>();

		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			String sCurrentLine;
			StringBuffer statementBuf = new StringBuffer();

			boolean isNew;
			while ((sCurrentLine = br.readLine()) != null) {
				sCurrentLine = sCurrentLine.trim();
			//	System.out.println("    : " + sCurrentLine);
				isNew = false;
				if (statementBuf.length() == 0) {
					for (int i = 0; i < STATEMENT_TYPES.length; i++) {
						if (sCurrentLine.toLowerCase().startsWith(STATEMENT_TYPES[i])) {
							statementBuf.append(sCurrentLine);
							isNew = true;
							break;
						}
					}
				}

				if (statementBuf.length() > 0) {
					if(!isNew) {
						statementBuf.append(sCurrentLine);
					}
					if(sCurrentLine.contains(";")) {
					//	System.out.println("         add> " + statementBuf.toString() );
						statements.add(statementBuf.toString());
						statementBuf = new StringBuffer(); 
					}
				}

			}

		} catch (IOException e) {
			e.printStackTrace();
		}

		return statements;
	}
}
