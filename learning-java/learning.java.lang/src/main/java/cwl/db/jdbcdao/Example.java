package cwl.db.jdbcdao;

import java.util.Date;

public class Example {
    private int id;
    private String title;
    private String description;
    private Date publicationDate;

    public Example() {
    }

    public Example(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public int getExampleId() {
        return id;
    }

    public void setExampleId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(Date publicationDate) {
        this.publicationDate = publicationDate;
    }

    public String toString() {
        return id + " - " + title + " - " + description;
    }
}
