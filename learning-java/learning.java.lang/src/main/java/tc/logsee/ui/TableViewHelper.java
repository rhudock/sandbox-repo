package tc.logsee.ui;

import com.google.common.io.Resources;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.TableColumn;
import javafx.scene.control.cell.PropertyValueFactory;
import tc.logsee.model.LogLine;
import tc.logsee.service.impl.FileService;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.List;

public class TableViewHelper
{
    // Returns an observable list of persons
    public static ObservableList<LogLine> getLogLineList()
    {
        File file = new File("/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/target/test-classes/file/jvm-example.log.sample");

        URI uri = null;
        try {
            uri = Resources.getResource("file/jvm-example.log.sample").toURI();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        List<LogLine> logLineList = FileService.readLog(uri);

        ObservableList<LogLine> persons = FXCollections.<LogLine>observableArrayList();

        persons.setAll(logLineList);

        return persons;
    }

    // Returns an observable list of persons
    public static ObservableList<LogLine> getLogLineList(File selectedFile)
    {

        URI uri = selectedFile.toURI();

        List<LogLine> logLineList = FileService.readLog(uri);

        ObservableList<LogLine> logLines = FXCollections.<LogLine>observableArrayList();

        logLines.setAll(logLineList);

        return logLines;
    }

    // Returns Person Id TableColumn
    public static TableColumn<LogLine, LocalDateTime> getTimeColumn()
    {
        TableColumn<LogLine, LocalDateTime> idCol = new TableColumn<>("time");
        PropertyValueFactory<LogLine, LocalDateTime> idCellValueFactory = new PropertyValueFactory<>("time");
        idCol.setCellValueFactory(idCellValueFactory);
        return idCol;
    }

    // Returns First Name TableColumn
    public static TableColumn<LogLine, String> getLogLevelColumn()
    {
        TableColumn<LogLine, String> logLevelCol = new TableColumn<>("log Level");
        PropertyValueFactory<LogLine, String> logLevelCellValueFactory = new PropertyValueFactory<>("logLevel");
        logLevelCol.setCellValueFactory(logLevelCellValueFactory);
        return logLevelCol;
    }

    // Returns Last Name TableColumn
    public static TableColumn<LogLine, String> getClazzColumn()
    {
        TableColumn<LogLine, String> ClazzCol = new TableColumn<>("Clazz");
        PropertyValueFactory<LogLine, String> ClazzCellValueFactory = new PropertyValueFactory<>("Clazz");
        ClazzCol.setCellValueFactory(ClazzCellValueFactory);
        return ClazzCol;
    }

    public static TableColumn<LogLine, String> getLogColumn()
    {
        TableColumn<LogLine, String> ClazzCol = new TableColumn<>("Log");
        PropertyValueFactory<LogLine, String> ClazzCellValueFactory = new PropertyValueFactory<>("Log");
        ClazzCol.setCellValueFactory(ClazzCellValueFactory);
        return ClazzCol;
    }

    public static TableColumn<LogLine, String> getLogLineColumn()
    {
        TableColumn<LogLine, String> ClazzCol = new TableColumn<>("LogLine");
        PropertyValueFactory<LogLine, String> ClazzCellValueFactory = new PropertyValueFactory<>("LogLine");
        ClazzCol.setCellValueFactory(ClazzCellValueFactory);
        return ClazzCol;
    }


}